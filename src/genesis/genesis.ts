import * as grpc from "grpc";
import * as fsmpb from "../fsmpb/fsm_pb";
import * as fsm_grpc from "../fsmpb/fsm_grpc_pb";
import * as datapb from "../datapb/reflect"

import * as health from "grpc-health-check/health";
import {toPuppetType} from "./puppet_types";
import * as net from "net";
import {ServerDuplexStream} from "grpc";
import {Data, FromDataConverter, ToDataConverter} from "./richdata";

const InvokeAction = 0;
const GenesisResource = 10;
const GenesisNotice = 11;

export type NamedValues = { [s: string]: any };
export type StringMap = { [s: string]: string };

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
type MessageStream = ServerDuplexStream<fsmpb.Message, fsmpb.Message>

export type ParamDecl = { type: string, lookup: Data }
export type ParamMap = { [x: string]: string | ParamDecl }

export interface Action {
  readonly input?: ParamMap;
  readonly output?: StringMap;
}

export interface Function extends Action {
  readonly producer: ActionFunction;
}

export interface Actor extends Action {
  readonly actions : { [s: string]: Function | Actor };
}

export abstract class Resource {
  readonly title: string;

  protected constructor({title}: { title: string }) {
    this.title = title
  }

  __ptype() : string {
    return 'Resource'
  }

  __pvalue() : {[s: string]: any} {
    return { title: this.title };
  }
}

export class Context {
  private readonly stream: MessageStream;
  private readonly toData: ToDataConverter;
  private readonly fromData: FromDataConverter;

  private call<T extends {}>(id: number, argsHash: {}): Promise<T> {
    return new Promise((resolve: (result: T) => void, reject: (reason?: any) => void) => {
      try {
        let am = new fsmpb.Message();
        am.setId(id);
        am.setValue(datapb.toData(this.toData.convert(argsHash)));

        let stream = this.stream;
        stream.once('data', (result: fsmpb.Message) => {
          if (result.getId() != id) {
            throw new Error(`expected reply with id ${id}, got ${result.getId()}`);
          }
          resolve(this.fromData.convert(<T>datapb.fromData(result.getValue())));
        });
        stream.write(am);
      } catch (err) {
        reject(err);
      }
    });
  }

  resource<T extends Resource>(resource: T): Promise<T> {
    return this.call<T>(GenesisResource, resource)
  }

  notice(message: string): void {
    let am = new fsmpb.Message();
    am.setId(GenesisNotice);
    am.setValue(datapb.toData(message));
    this.stream.write(am);
  }

  constructor(stream: MessageStream) {
    this.stream = stream;
    this.toData = new ToDataConverter(exports);
    this.fromData = new FromDataConverter(exports);
  }
}

class FunctionImpl implements Function {
  readonly producer: ActionFunction;
  readonly input?: ParamMap;
  readonly output?: StringMap;

  constructor(action : Function) {
    this.producer = action.producer;
    this.input = action.input;
    this.output = action.output;
  }

  private static convertType(t : string, types: StringMap) : string {
    let ct = types[t];
    if(ct === undefined)
      ct = toPuppetType(t);
    return ct;
  }

  static createParams(values: ParamMap, types: StringMap): Array<fsmpb.Parameter> {
    let params: Array<fsmpb.Parameter> = [];
    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        let value = values[key];
        let p = new fsmpb.Parameter();
        if(typeof value === 'string') {
          p.setType(this.convertType(<string>value, types));
        } else {
          let pd = <ParamDecl>value;
          p.setType(this.convertType(pd.type, types));
          p.setLookup(datapb.toData(pd.lookup));
        }
        p.setName(key);
        params.push(p);
      }
    }
    return params;
  }

  pbAction(name: string, types: StringMap): fsmpb.Action {
    let a = new fsmpb.Action();
    a.setName(name);
    a.setInputList(FunctionImpl.createParams(this.input, types));
    a.setOutputList(FunctionImpl.createParams(this.output, types));
    return a;
  }
}

export class ActorServer {
  private readonly server: grpc.Server;
  private readonly startPort : number;
  private readonly endPort : number;
  private readonly actors : { [s: string]: Actor };
  private readonly types : StringMap;

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
    this.types = {};
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

  addActor(name : string, declaration: Actor) : void {
    this.actors[name] = new ActorImpl(name, declaration);
  }

  registerType(name : string, decl: string) {
    this.types[name] = toPuppetType(decl);
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
        let action = actor.actions[key];
        if((<FunctionImpl>action).pbAction !== undefined)
          as.push((<FunctionImpl>action).pbAction(key, this.types))
      }
      ar.setActionsList(as);
      ar.setInputList(FunctionImpl.createParams(actor.input, this.types));
      ar.setOutputList(FunctionImpl.createParams(actor.output, this.types));
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
    (<Function>action).producer(genesis, ad[2]).then((result: {}) => {
      am.setValue(datapb.toData(result));
      stream.write(am);
    });
  }
}

class ActorImpl implements Actor {
  readonly name: string;
  readonly input?: ParamMap;
  readonly output?: StringMap;
  readonly actions : { [s: string]: Function | Actor };

  constructor(name : string, declaration : Actor) {
    this.name = name;
    this.input = declaration.input;
    this.output = declaration.output;
    this.actions = {};
    for(let actionName in declaration.actions) {
      let action = declaration.actions[actionName];
      this.actions[actionName] = (<Function>action).producer === undefined
        ? new ActorImpl(actionName, <Actor>action)
        : new FunctionImpl(<Function>action);
    }
  }
}

