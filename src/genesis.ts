import * as grpc from "grpc";
import * as fsmpb from "./fsmpb/fsm_pb";
import * as fsm_grpc from "./fsmpb/fsm_grpc_pb";

import * as datapb from "./datapb/reflect";
import * as health from "grpc-health-check/health";
import {Duplex} from "stream";


const GenesisApply = -10;
const GenesisLookup = -11;
const GenesisNotice = -12;

type ActionFunction = (genesis: Context, input: {}) => Promise<{}>;

export abstract class Resource {
  readonly title: string;

  protected constructor({title}: { title: string }) {
    this.title = title
  }
}

export class Context {
  private stream: Duplex;

  private call<T extends {}>(id: number, argsHash: {}): Promise<T> {
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
    if (!(typeof keys == 'object' && keys.constructor == Array)) {
      keys = [<string>keys];
      singleton = true;
    }
    let result = await this.call<{ value: any }>(GenesisLookup, {keys: keys});
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

type StringMap = { [s: string]: string };

export class Action {
  readonly callback: ActionFunction;
  readonly consumes: StringMap;
  readonly produces: StringMap;

  constructor({callback, consumes = {}, produces = {}}: { callback: ActionFunction, consumes?: StringMap, produces?: StringMap }) {
    this.callback = callback;
    this.consumes = consumes;
    this.produces = produces;
  }

  private static createParams(values: {}): Array<fsmpb.Parameter> {
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
  }

  pbAction(id: number, name: string): fsmpb.Action {
    let a = new fsmpb.Action();
    a.setId(id);
    a.setName(name);
    a.setConsumesList(Action.createParams(this.consumes));
    a.setProducesList(Action.createParams(this.produces));
    return a;
  }
}

export class Actor {
  server: grpc.Server;

  actions: Array<fsmpb.Action>;
  actionFunctions: Array<ActionFunction>;

  invokeAction(am: fsmpb.ActionMessage, stream: Duplex) {
    let id = am.getId();
    let functions = this.actionFunctions;
    if (id < 0 || id >= functions.length) {
      throw new Error(`expected action id to be between 0 and ${functions.length}, got ${id}`)
    }
    let args = datapb.fromDataHash(am.getArguments());
    let genesis = new Context(stream);
    functions[id](genesis, args).then((result: {}) => {
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

  constructor(actions: { [name: string]: Action }) {
    this.actions = [];
    this.actionFunctions = [];
    for (let key in actions) {
      let action = actions[key];
      this.actions.push(action.pbAction(this.actions.length, key));
      this.actionFunctions.push(action.callback);
    }
    this.server = new grpc.Server();
    this.server.addService(fsm_grpc.ActorService, {
      getActions  : (call, callback) => {
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

