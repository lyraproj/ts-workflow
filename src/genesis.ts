import * as grpc from "grpc";
import * as fsmpb from "./fsmpb/fsm_pb";
import * as fsm_grpc from "./fsmpb/fsm_grpc_pb";

import * as datapb from "./datapb/reflect";
import * as health from "grpc-health-check/health";
import {toPuppetType} from "./puppet_types";
import * as net from "net";
import {ServerDuplexStream} from "grpc";

const InvokeAction = 0;
const GenesisApply = 10;
const GenesisLookup = 11;
const GenesisNotice = 12;

export type NamedValues = { [s: string]: any };

type ActionData = [string, string, NamedValues];

function isNamedValues(value: any): value is NamedValues {
  return typeof value === 'object' && value.constructor == Object;
}

function isActionData(value : any): value is ActionData {
  if(Array.isArray(value)) {
    let av = <any[]>value;
    return av.length === 3 && typeof av[0] === 'string' && typeof av[1] === 'string' && isNamedValues(av[2]);
  }
  return false;
}

type ActionFunction = (genesis: Context, input: NamedValues) => Promise<NamedValues>;
type StringMap = { [s: string]: string };
type MessageStream = ServerDuplexStream<fsmpb.Message, fsmpb.Message>

export abstract class Resource {
  readonly title: string;

  protected constructor({title}: { title: string }) {
    this.title = title
  }
}

export class Context {
  private readonly stream: MessageStream;

  private call<T extends {}>(id: number, argsHash: {}): Promise<T> {
    return new Promise((resolve: (result: T) => void, reject: (reason?: any) => void) => {
      try {
        let am = new fsmpb.Message();
        am.setId(id);
        am.setValue(datapb.toData(argsHash));

        let stream = this.stream;
        stream.once('data', (result: fsmpb.Message) => {
          if (result.getId() != id) {
            throw new Error(`expected reply with id ${id}, got ${result.getId()}`);
          }
          resolve(<T>datapb.fromData(result.getValue()));
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
    if (!Array.isArray(keys)) {
      keys = [<string>keys];
      singleton = true;
    }
    let result = await this.call<{ [s: string] : any}>(GenesisLookup, keys);
    return singleton ? result[keys[0]] : result;
  }

  notice(message: string): void {
    let am = new fsmpb.Message();
    am.setId(GenesisNotice);
    am.setValue(datapb.toData(message));
    this.stream.write(am);
  }

  constructor(stream: MessageStream) {
    this.stream = stream;
  }
}

export class Action {
  readonly callback: ActionFunction;
  readonly input: StringMap;
  readonly output: StringMap;

  constructor({callback, input = {}, output = {}}: { callback: ActionFunction, input?: StringMap, output?: StringMap }) {
    this.callback = callback;
    this.input = input;
    this.output = output;
  }

  private static convertType(t : string) : string {
    return toPuppetType(t);
  }

  private static createParams(values: {}): Array<fsmpb.Parameter> {
    let params: Array<fsmpb.Parameter> = [];
    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        let p = new fsmpb.Parameter();
        p.setName(key);
        p.setType(this.convertType(values[key]));
        params.push(p);
      }
    }
    return params;
  }

  pbAction(name: string): fsmpb.Action {
    let a = new fsmpb.Action();
    a.setName(name);
    a.setInputList(Action.createParams(this.input));
    a.setOutputList(Action.createParams(this.output));
    return a;
  }
}

export class ActorServer {
  private readonly server: grpc.Server;
  private readonly startPort : number;
  private readonly endPort : number;
  private readonly actors : { [s: string]: Actor };

  private static getAvailablePort(start : number, end : number) : Promise<number> {
    function getNextAvailablePort(currentPort : number, resolve : (port : number) => void, reject : (reason? : Error) => void) {
      const server = net.createServer();
      server.listen(currentPort, () => {
        server.once('close', () => {
          resolve(currentPort);
        });
        server.close();
      });

      server.on('error', () => {
        if(++currentPort >= end) {
          reject(new Error(`unable to find a free port in range ${start} - ${end}`))
        } else {
          getNextAvailablePort(++currentPort, resolve, reject);
        }
      });
    }
    return new Promise((resolve, reject) => {
      getNextAvailablePort(start, resolve, reject);
    });
  }

  constructor(startPort : number, endPort : number) {
    this.server = new grpc.Server();
    this.startPort = startPort;
    this.endPort = endPort;
    this.actors = {};
    this.server.addService(health.service, new health.Implementation({plugin: 'SERVING'}));
    this.server.addService(fsm_grpc.ActorsService, {
      getActor : (call : grpc.ServerUnaryCall<fsmpb.ActorRequest>, callback : (error : Error | null, actor : fsmpb.Actor) => void) => {
        callback(null, this.getActor(call.request.getName()))
      },
      invokeAction: (stream: MessageStream) => {
        stream.on('data', am => {
          if (am.getId() == InvokeAction) {
            this.invokeAction(am, stream)
          }
        });
        stream.on('end', () => stream.end());
      },
    });
  }

  addActor(name : string, actions: { [name: string]: Action }) : void {
    this.actors[name] = new Actor(name, actions);
  }

  start() {
    ActorServer.getAvailablePort(this.startPort, this.endPort).then(port => {
      let addr = `0.0.0.0:${port}`;
      this.server.bind(addr, grpc.ServerCredentials.createInsecure());

      // go-plugin awaits this reply on stdout
      console.log(`1|1|tcp|${addr}|grpc`);

      process.stderr.write(`using address ${addr}\n`);
      this.server.start();
    });
  }

  private getActor(actorName : string): fsmpb.Actor {
    // TODO: Load on demand instead of using addActor function to populate
    let actor = this.actors[actorName];
    if(actor !== undefined) {
      let ar = new fsmpb.Actor();
      let as : Array<fsmpb.Action> = [];
      for(let key in actor.actions) {
        as.push(actor.actions[key].pbAction(key))
      }
      ar.setActionsList(as);
      return ar;
    }
    throw new Error(`no such actor '${actorName}'`);
  }

  private invokeAction(am: fsmpb.Message, stream: MessageStream) {
    let value = datapb.fromData(am.getValue());
    if(!isActionData(value)) {
      process.stderr.write(`data ${value}\n`);
      throw new Error('unexpected data sent to invokeAction');
    }

    let ad = <ActionData>value;
    let actorName = ad[0];
    let actor = this.actors[actorName];
    if(actor === undefined)
      throw new Error(`no such actor '${actorName}'`);

    let actionName = ad[1];
    let action = actor.actions[actionName];
    if(action === undefined)
      throw new Error(`no such action '${actionName}' in actor '${actorName}'`);

    let genesis = new Context(stream);
    action.callback(genesis, ad[2]).then((result: {}) => {
      am.setValue(datapb.toData(result));
      stream.write(am);
    });
  }
}

class Actor {
  readonly name: string;
  readonly actions : { [s: string]: Action };

  constructor(name : string, actions: { [s: string]: Action }) {
    this.name = name;
    this.actions = actions;
  }
}

