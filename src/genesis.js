"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grpc = require("grpc");
var fsmpb = require("./fsmpb/fsm_pb");
var fsm_grpc = require("./fsmpb/fsm_grpc_pb");
var datapb = require("./datapb/data_pb");
var health = require("grpc-health-check/health");
function fromDataHash(dataHash) {
    var hash = {};
    dataHash.getEntriesList().forEach(function (entry) {
        hash[entry.getKey()] = fromData(entry.getValue());
    });
    return hash;
}
function fromData(data) {
    var kind = data.getKindCase();
    var vkind = kind.valueOf();
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
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}
// Returns if a value is really a number
function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}
// Returns if a value is an array
function isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
}
// Returns if a value is an object
function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
}
function toDataHash(value) {
    var entries = [];
    for (var key in value) {
        var entry = new datapb.DataEntry();
        entry.setKey(key);
        entry.setValue(toData(value[key]));
        entries.push(entry);
    }
    var dh = new datapb.DataHash();
    dh.setEntriesList(entries);
    return dh;
}
function toData(value) {
    var d = new datapb.Data();
    if (value === null) {
        d.setUndefValue(null);
        return d;
    }
    switch (typeof value) {
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
            var a = new datapb.DataArray();
            a.setValuesList(value.map(fromData));
            d.setArrayValue(a);
            break;
        case 'object':
            if (value.constructor === Object) {
                d.setHashValue(toDataHash(value));
            } // TODO: Handle invalid objects
            break;
        default:
        // TODO: Handle illegal types
    }
    return d;
}
var Context = /** @class */ (function () {
    function Context() {
        var ctx = this;
        var statusMap = {};
        this.actions = [];
        this.actionFunctions = [];
        this.server = new grpc.Server();
        this.server.addService(fsm_grpc.ActorService, {
            getActions: function (call, callback) {
                callback(null, ctx.getActions());
            },
            invokeAction: function (call, callback) {
                callback(null, ctx.invokeAction(call.request));
            },
        });
        this.server.addService(health.service, new health.Implementation({ plugin: 'SERVING' }));
    }
    Context.prototype.Action = function (name, func, consumes, produces) {
        var consumeParams = [];
        var produceParams = [];
        for (var key in consumes) {
            var p = new fsmpb.Parameter();
            p.setName(key);
            p.setType(consumes[key]);
            consumeParams.push(p);
        }
        var createParams = function (values) {
            var params = [];
            for (var key in values) {
                var p = new fsmpb.Parameter();
                p.setName(key);
                p.setType(values[key]);
                params.push(p);
            }
            return params;
        };
        var a = new fsmpb.Action();
        a.setId(this.actions.length);
        a.setName(name);
        a.setConsumesList(createParams(consumes));
        a.setProducesList(createParams(produces));
        this.actions.push(a);
        this.actionFunctions.push(func);
    };
    Context.prototype.invokeAction = function (ar) {
        var args = ar.getArguments();
        return toDataHash(this.actionFunctions[ar.getId()](fromDataHash(args)));
    };
    Context.prototype.getActions = function () {
        var ar = new fsmpb.ActionsResponse();
        ar.setActionsList(this.actions);
        return ar;
    };
    Context.prototype.start = function () {
        this.server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
        console.log("1|1|tcp|0.0.0.0:50051|grpc");
        this.server.start();
    };
    return Context;
}());
exports.Context = Context;
var ctx = new Context();
ctx.Action('a', function (input) {
    return { a: 'hello', b: 4 };
}, {}, { a: 'String', b: 'Integer' });
ctx.Action('b1', function (input) {
    return { c: input.a + ' world', d: input.b + 4 };
}, { a: 'String', b: 'Integer' }, { c: 'String', d: 'Integer' });
ctx.Action('b2', function (input) {
    return { e: input.a + ' earth', f: input.b + 8 };
}, { a: 'String', b: 'Integer' }, { e: 'String', f: 'Integer' });
ctx.Action('c', function (input) {
    console.log(input);
    return {};
}, { c: 'String', d: 'Integer', e: 'String', f: 'Integer' }, {});
ctx.start();
