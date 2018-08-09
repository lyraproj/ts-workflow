import * as grpc from "grpc";
import * as fsmpb from "./fsmpb/fsm_pb";
import * as fsm_grpc from "./fsmpb/fsm_grpc_pb";

import * as datapb from "./datapb/reflect";
import * as health from "grpc-health-check/health";
import {Duplex} from "stream";

type ActionFunction = (genesis: Genesis, input: object) => Promise<object>;

const GenesisServiceID = -10;

export class Genesis {
  stream: Duplex;

  apply(resources: object): Promise<object> {
    return new Promise((resolve: (result: object) => void, reject: (reason?: any) => void) => {
      try {
        let am = new fsmpb.ActionMessage();
        am.setId(GenesisServiceID);
        am.setArguments(datapb.toDataHash(resources));

        let stream = this.stream;
        stream.once('data', (result: fsmpb.ActionMessage) => {
          if (result.getId() != GenesisServiceID) {
            throw new Error(`expected reply with id ${GenesisServiceID}, got ${result.getId()}`);
          }
          resolve(datapb.fromDataHash(result.getArguments()));
        });
        stream.write(am);
      } catch (err) {
        reject(err);
      }
    });
  }

  constructor(stream: Duplex) {
    this.stream = stream;
  }
}

export class Actor {
  server: grpc.Server;

  actions: Array<fsmpb.Action>;
  actionFunctions: Array<ActionFunction>;

  Action(name: string, func: ActionFunction, consumes: object, produces: object): void {
    let createParams = (values: object): Array<fsmpb.Parameter> => {
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
    funcs[id](genesis, args).then((result: object) => {
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
