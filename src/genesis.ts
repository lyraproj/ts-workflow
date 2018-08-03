import * as grpc from "grpc";
import * as fsmpb from "./fsmpb/fsm_pb";
import * as fsm_grpc from "./fsmpb/fsm_grpc_pb";

import * as datapb from "./datapb/data_pb";
import * as health from "grpc-health-check/health";
import {printLine} from "tslint/lib/verify/lines";

function fromDataHash(dataHash: datapb.DataHash): object {
    let hash = {};
    dataHash.getEntriesList().forEach(function(entry: datapb.DataEntry) {
        hash[entry.getKey()] = fromData(entry.getValue());
    })
    return hash;
}

function fromData(data: datapb.Data): any {
    let kind = data.getKindCase();
    let vkind = kind.valueOf();
    switch (vkind) {
        case datapb.Data.KindCase.BOOLEAN_VALUE:
            return data.getBooleanValue();
        case datapb.Data.KindCase.INTEGER_VALUE:
            return data.getIntegerValue();
        case datapb.Data.KindCase.FLOAT_VALUE:
            return data.getFloatValue();
        case datapb.Data.KindCase.STRING_VALUE:
            return data.getStringValue();
        case datapb.Data.KindCase.ARRAY_VALUE:
            return data.getArrayValue().getValuesList().map(fromData);
        case datapb.Data.KindCase.HASH_VALUE:
            return fromDataHash(data.getHashValue());
    }
    return null;
}

// Returns if a value is a string
function isString (value) {
    return typeof value === 'string' || value instanceof String;
}

// Returns if a value is really a number
function isNumber (value) {
    return typeof value === 'number' && isFinite(value);
}

// Returns if a value is an array
function isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
}

// Returns if a value is an object
function isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object;
}

function toDataHash(value: object): datapb.DataHash {
    let entries: Array<datapb.DataEntry> = []
    for(let key in value) {
        let entry = new datapb.DataEntry();
        entry.setKey(key);
        entry.setValue(toData(value[key]));
        entries.push(entry);
    }
    let dh = new datapb.DataHash();
    dh.setEntriesList(entries);
    return dh;
}

function toData(value: any): datapb.Data {
    let d = new datapb.Data();
    if(value === null) {
        d.setUndefValue(null);
        return d;
    }

    switch(typeof value) {
        case 'number':
            value % 1 === 0 ? d.setIntegerValue(value) : d.setFloatValue(value);
            break;
        case 'boolean':
            d.setBooleanValue(value);
            break;
        case 'string':
            d.setStringValue(value);
            break;
        case 'array':
            let a = new datapb.DataArray();
            a.setValuesList((<Array<any>>value).map(fromData));
            d.setArrayValue(a);
            break;
        case 'object':
            if (value.constructor === Object) {
                d.setHashValue(toDataHash((<object>value)));
            } // TODO: Handle invalid objects
            break;
        default:
            // TODO: Handle illegal types
    }
    return d;
}

export class Context {
    server: grpc.Server;

    actions : Array<fsmpb.Action>;
    actionFunctions : Array<(input: Object) => object>;

    Action(name: string, func: (input: Object) => object, consumes: object, produces: object) : void {
        let consumeParams: Array<fsmpb.Parameter> = []
        let produceParams: Array<fsmpb.Parameter> = []
        for(let key in consumes) {
            let p = new fsmpb.Parameter();
            p.setName(key);
            p.setType(consumes[key]);
            consumeParams.push(p);
        }

        let createParams = function(values: object): Array<fsmpb.Parameter> {
            let params: Array<fsmpb.Parameter> = [];
            for(let key in values) {
                let p = new fsmpb.Parameter();
                p.setName(key);
                p.setType(values[key]);
                params.push(p);
            }
            return params;
        }

        let a = new fsmpb.Action();
        a.setId(this.actions.length);
        a.setName(name);
        a.setConsumesList(createParams(consumes));
        a.setProducesList(createParams(produces));
        this.actions.push(a);
        this.actionFunctions.push(func);
    }


    invokeAction(ar: fsmpb.ActionInvocation) : datapb.DataHash {
        let args = ar.getArguments();
        return toDataHash(this.actionFunctions[ar.getId()](fromDataHash(args)));
    }

    getActions(): fsmpb.ActionsResponse {
        let ar = new fsmpb.ActionsResponse();
        ar.setActionsList(this.actions);
        return ar;
    }

    start(): void {
        this.server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
        console.log("1|1|tcp|0.0.0.0:50051|grpc");
        this.server.start();
    }

    constructor() {
        var ctx = this;
        var statusMap = {};
        this.actions = [];
        this.actionFunctions = [];
        this.server = new grpc.Server();
        this.server.addService(fsm_grpc.ActorService, {
            getActions: function(call, callback) {
                callback(null, ctx.getActions())
            },
            invokeAction: function(call, callback) {
                callback(null, ctx.invokeAction(call.request))
            },
        });
        this.server.addService(health.service, new health.Implementation({plugin: 'SERVING'}));
    }
}

var ctx = new Context();

ctx.Action('a', function(input: object): {a: string, b: number} {
    return { a: 'hello', b: 4 };
}, {}, { a: 'String', b: 'Integer' } );

ctx.Action('b1', function(input: {a: string, b: number}): {c: string, d: number} {
    return { c: input.a + ' world', d: input.b + 4 };
}, { a: 'String', b: 'Integer' }, { c: 'String', d: 'Integer' } );

ctx.Action('b2', function(input: {a: string, b: number}): {e: string, f: number} {
    return { e: input.a + ' earth', f: input.b + 8 };
}, { a: 'String', b: 'Integer' }, { e: 'String', f: 'Integer' } );

ctx.Action('c', function(input: {c: string, d: number, e: string, f: number}): {} {
    console.log(input)
    return {}
}, { c: 'String', d: 'Integer', e: 'String', f: 'Integer' }, {} );

ctx.start();
