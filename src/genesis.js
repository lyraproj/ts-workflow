"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const fsmpb = require("./fsmpb/fsm_pb");
const fsm_grpc = require("./fsmpb/fsm_grpc_pb");
const datapb = require("./datapb/reflect");
const health = require("grpc-health-check/health");
const GenesisApply = -10;
const GenesisLookup = -11;
const GenesisNotice = -12;
class Resource {
    constructor({ title }) {
        this.title = title;
    }
}
exports.Resource = Resource;
class Context {
    call(id, argsHash) {
        return new Promise((resolve, reject) => {
            try {
                let am = new fsmpb.ActionMessage();
                am.setId(id);
                am.setArguments(datapb.toDataHash(argsHash));
                let stream = this.stream;
                stream.once('data', (result) => {
                    if (result.getId() != id) {
                        throw new Error(`expected reply with id ${id}, got ${result.getId()}`);
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
    apply(resource) {
        return this.call(GenesisApply, resource);
    }
    lookup(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            let singleton = false;
            if (!(typeof keys == 'object' && keys.constructor == Array)) {
                keys = [keys];
                singleton = true;
            }
            let result = yield this.call(GenesisLookup, { keys: keys });
            return singleton ? result[keys[0]] : result;
        });
    }
    notice(message) {
        let am = new fsmpb.ActionMessage();
        am.setId(GenesisNotice);
        am.setArguments(datapb.toDataHash({ message: message }));
        this.stream.write(am);
    }
    constructor(stream) {
        this.stream = stream;
    }
}
exports.Context = Context;
class Action {
    constructor({ callback, input = {}, output = {} }) {
        this.callback = callback;
        this.input = input;
        this.output = output;
    }
    static createParams(values) {
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
    }
    pbAction(id, name) {
        let a = new fsmpb.Action();
        a.setId(id);
        a.setName(name);
        a.setInputList(Action.createParams(this.input));
        a.setOutputList(Action.createParams(this.output));
        return a;
    }
}
exports.Action = Action;
class Actor {
    invokeAction(am, stream) {
        let id = am.getId();
        let functions = this.actionFunctions;
        if (id < 0 || id >= functions.length) {
            throw new Error(`expected action id to be between 0 and ${functions.length}, got ${id}`);
        }
        let args = datapb.fromDataHash(am.getArguments());
        let genesis = new Context(stream);
        functions[id](genesis, args).then((result) => {
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
    constructor(actions) {
        this.actions = [];
        this.actionFunctions = [];
        for (let key in actions) {
            let action = actions[key];
            this.actions.push(action.pbAction(this.actions.length, key));
            this.actionFunctions.push(action.callback);
        }
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
