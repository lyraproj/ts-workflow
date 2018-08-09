import * as grpc from "grpc";
import * as fsmpb from "./fsmpb/fsm_pb";
import * as fsm_grpc from "./fsmpb/fsm_grpc_pb";

import * as datapb from "./datapb/reflect";
import * as health from "grpc-health-check/health";
import {Duplex} from "stream";

type ActionFunction = (genesis: Genesis, input: {}) => Promise<{}>;

const GenesisApply = -10;
const GenesisLookup = -11;
const GenesisNotice = -12;

export interface Resource {
  title : string
}

export class Genesis {
  stream: Duplex;

  private call<T extends {}>(id : number, argsHash: {}): Promise<T> {
    return new Promise((resolve: (result: T) => void, reject: (reason?: any) => void) => {
      try {
        let am = new fsmpb.ActionMessage();
        am.setId(id);
        am.setArguments(datapb.toDataHash(argsHash));

        let stream = this.stream;
        stream.once('data', (result: fsmpb.ActionMessage) => {
          if (result.getId() != id) {
            throw new Error(`expected reply with id ${id}, got ${result.getId()}`);
          }
          resolve(<T>datapb.fromDataHash(result.getArguments()));
        });
        stream.write(am);
      } catch (err) {
        reject(err);
      }
    });
  }

  apply<T extends Resource>(resource: T): Promise<T> {
    return this.call<T>(GenesisApply, resource)
  }

  async lookup(keys: string | Array<string>): Promise<any> {
    let singleton = false;
    if(!(typeof keys == 'object' && keys.constructor == Array)) {
      keys = [<string>keys];
      singleton = true;
    }
    let result = await this.call<{ value: any }>(GenesisLookup, { keys: keys });
    return singleton ? result[keys[0]] : result;
  }

  notice(message: string): void {
    let am = new fsmpb.ActionMessage();
    am.setId(GenesisNotice);
    am.setArguments(datapb.toDataHash({message: message}));
    this.stream.write(am);
  }

  constructor(stream: Duplex) {
    this.stream = stream;
  }
}

export class Actor {
  server: grpc.Server;

  actions: Array<fsmpb.Action>;
  actionFunctions: Array<ActionFunction>;

  Action(name: string, func: ActionFunction, consumes: {}, produces: {}): void {
    let createParams = (values: {}): Array<fsmpb.Parameter> => {
      let params: Array<fsmpb.Parameter> = [];
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

  invokeAction(am: fsmpb.ActionMessage, stream: Duplex) {
    let id = am.getId();
    let funcs = this.actionFunctions;
    if (id < 0 || id >= funcs.length) {
      throw new Error(`expected action id to be between 0 and ${funcs.length}, got ${id}`)
    }
    let args = datapb.fromDataHash(am.getArguments());
    let genesis = new Genesis(stream);
    funcs[id](genesis, args).then((result: {}) => {
      am.setArguments(datapb.toDataHash(result));
      stream.write(am);
    });
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
    this.actions = [];
    this.actionFunctions = [];
    this.server = new grpc.Server();
    this.server.addService(fsm_grpc.ActorService, {
      getActions: (call, callback) => {
        callback(null, this.getActions())
      },
      invokeAction: (call: Duplex) => {
        call.on('data', (am: fsmpb.ActionMessage) => {
          if (am.getId() >= 0) {
            this.invokeAction(am, call)
          }
        });
        call.on('end', () => call.end());
      },
    });
    this.server.addService(health.service, new health.Implementation({plugin: 'SERVING'}));
  }
}
