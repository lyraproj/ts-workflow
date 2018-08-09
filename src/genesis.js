"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const fsmpb = require("./fsmpb/fsm_pb");
const fsm_grpc = require("./fsmpb/fsm_grpc_pb");
const datapb = require("./datapb/reflect");
const health = require("grpc-health-check/health");
const GenesisServiceID = -10;
class Genesis {
    apply(resources) {
        return new Promise((resolve, reject) => {
            try {
                let am = new fsmpb.ActionMessage();
                am.setId(GenesisServiceID);
                am.setArguments(datapb.toDataHash(resources));
                let stream = this.stream;
                stream.once('data', (result) => {
                    if (result.getId() != GenesisServiceID) {
                        throw new Error(`expected reply with id ${GenesisServiceID}, got ${result.getId()}`);
                    }
                    resolve(datapb.fromDataHash(result.getArguments()));
                });
                stream.write(am);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    constructor(stream) {
        this.stream = stream;
    }
}
exports.Genesis = Genesis;
class Actor {
    Action(name, func, consumes, produces) {
        let createParams = (values) => {
            let params = [];
            for (let key in values) {
                if (values.hasOwnProperty(key)) {
                    let p = new fsmpb.Parameter();
                    p.setName(key);
                    p.setType(values[key]);
                    params.push(p);
                }
            }
            return params;
        };
        let a = new fsmpb.Action();
        a.setId(this.actions.length);
        a.setName(name);
        a.setConsumesList(createParams(consumes));
        a.setProducesList(createParams(produces));
        this.actions.push(a);
        this.actionFunctions.push(func);
    }
    invokeAction(am, stream) {
        let id = am.getId();
        let funcs = this.actionFunctions;
        if (id < 0 || id >= funcs.length) {
            throw new Error(`expected action id to be between 0 and ${funcs.length}, got ${id}`);
        }
        let args = datapb.fromDataHash(am.getArguments());
        let genesis = new Genesis(stream);
        funcs[id](genesis, args).then((result) => {
            am.setArguments(datapb.toDataHash(result));
            stream.write(am);
        });
    }
    getActions() {
        let ar = new fsmpb.ActionsResponse();
        ar.setActionsList(this.actions);
        return ar;
    }
    start() {
        this.server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
        console.log("1|1|tcp|0.0.0.0:50051|grpc");
        this.server.start();
    }
    constructor() {
        this.actions = [];
        this.actionFunctions = [];
        this.server = new grpc.Server();
        this.server.addService(fsm_grpc.ActorService, {
            getActions: (call, callback) => {
                callback(null, this.getActions());
            },
            invokeAction: (call) => {
                call.on('data', (am) => {
                    if (am.getId() >= 0) {
                        this.invokeAction(am, call);
                    }
                });
                call.on('end', () => call.end());
            },
        });
        this.server.addService(health.service, new health.Implementation({ plugin: 'SERVING' }));
    }
}
exports.Actor = Actor;
