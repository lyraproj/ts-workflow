import * as grpc from 'grpc';
import {sendUnaryData, ServerUnaryCall} from 'grpc';
import {GrpcHealthCheck, HealthCheckResponse, HealthService} from 'grpc-ts-health-check';
import * as net from 'net';

import {Data} from '../datapb/data_pb';
import {toData} from '../datapb/reflect';
import {Context} from '../pcore/Context';
import {Deserializer} from '../pcore/Deserializer';
import {StreamLogger} from '../pcore/Logger';
import {consumePBData, ProtoConsumer} from '../pcore/ProtoConsumer';
import {Serializer} from '../pcore/Serializer';
import {TypedName} from '../pcore/TypedName';
import {StringHash, Value} from '../pcore/Util';
import {DefinitionServiceService} from '../servicepb/service_grpc_pb';
import {EmptyRequest, InvokeRequest, MetadataResponse, StateRequest} from '../servicepb/service_pb';

import {Definition, ServiceBuilder, StateProducer} from './ServiceBuilder';

export class Service {
  readonly serviceId: TypedName;
  readonly callables: {[s: string]: {[s: string]: Function}} = {};
  private readonly server: grpc.Server;
  private readonly startPort: number;
  private readonly endPort: number;
  private readonly context: Context;
  private readonly definitions: Definition[];
  private readonly stateProducers: {[s: string]: StateProducer};

  private static getAvailablePort(start: number, end: number): Promise<number> {
    function getNextAvailablePort(
        currentPort: number, resolve: (port: number) => void, reject: (reason?: Error) => void) {
      const server = net.createServer();
      server.listen(currentPort, () => {
        server.once('close', () => {
          resolve(currentPort);
        });
        server.close();
      });

      server.on('error', () => {
        if (++currentPort >= end) {
          reject(new Error(`unable to find a free port in range ${start} - ${end}`));
        } else {
          getNextAvailablePort(++currentPort, resolve, reject);
        }
      });
    }
    return new Promise((resolve, reject) => {
      getNextAvailablePort(start, resolve, reject);
    });
  }

  private static toData(ctx: Context, value: Value): Data {
    const consumer = new ProtoConsumer();
    const ser = new Serializer(ctx, {});
    ser.convert(value, consumer);
    return consumer.value();
  }

  private static fromData(ctx: Context, value: Data|undefined): Value {
    if (value === undefined) {
      return null;
    }
    const consumer = new Deserializer(ctx, {});
    consumePBData(value, consumer);
    return consumer.value();
  }

  constructor(nsBase: Value, sb: ServiceBuilder, startPort: number, endPort: number) {
    this.server = new grpc.Server();
    this.serviceId = sb.serviceId;
    this.startPort = startPort;
    this.endPort = endPort;
    this.context = new Context(nsBase, new StreamLogger(process.stderr));
    const cbs: {[s: string]: {[s: string]: Function}} = {};
    for (const [k, v] of Object.entries(sb.actionFunctions)) {
      cbs[k] = {do: v};
    }
    this.callables = cbs;
    this.definitions = sb.definitions;
    this.stateProducers = sb.stateProducers;

    this.registerHealthCheck();

    this.server.addService(DefinitionServiceService, {
      identity: (call: ServerUnaryCall<EmptyRequest>, callback: sendUnaryData<Data>) =>
          callback(null, Service.toData(this.context, this.serviceId)),

      invoke: (call: ServerUnaryCall<InvokeRequest>, callback: sendUnaryData<Data>) => {
        const rq = call.request;
        let ra = rq.getArguments();
        if (ra === undefined) {
          ra = toData(null);
        }
        const args = (Service.fromData(this.context, ra) as Value[]);
        const result = this.invoke(rq.getIdentifier(), rq.getMethod(), args);
        callback(null, Service.toData(this.context, result));
      },

      metadata: (call: ServerUnaryCall<EmptyRequest>, callback: sendUnaryData<MetadataResponse>) => {
        const md = this.metadata();
        const mdr = new MetadataResponse();
        mdr.setTypeset(Service.toData(this.context, md[0]));
        mdr.setDefinitions(Service.toData(this.context, md[1]));
        callback(null, mdr);
      },

      state: (call: ServerUnaryCall<StateRequest>, callback: sendUnaryData<Data>) => {
        const name = call.request.getIdentifier();
        let input = Service.fromData(this.context, call.request.getInput()) as StringHash;
        if (input === null) {
          input = {};
        }
        callback(null, Service.toData(this.context, this.state(name, input)));
      }
    });
  }

  invoke(identifier: string, name: string, args: Value[]): Value {
    const c = this.callables[identifier];
    if (c === undefined) {
      throw new Error(`Unable to find implementation of ${identifier}`);
    }
    const m = c[name];
    if (m === undefined) {
      throw new Error(`Implementation of ${identifier} has no method named ${name}`);
    }
    return m(...args);
  }

  metadata(): [null, Definition[]] {
    return [null, this.definitions];
  }

  state(name: string, input: StringHash): Value {
    const f = this.stateProducers[name];
    if (f === undefined) {
      throw new Error(`unable to find state producer for ${name}`);
    }

    const pns = Service.parameterNames(f);
    const args = new Array<Value>();
    if (input === null) {
      if (pns.length > 0) {
        throw Error(`state ${name} cannot be produced. Missing input parameter ${pns[0]}`);
      }
    } else {
      const ih = input as StringHash;
      for (let i = 0; i < pns.length; i++) {
        const pn = pns[i];
        const v = ih[pn];
        if (v === undefined) {
          throw Error(`state ${name} cannot be produced. Missing input parameter ${pn}`);
        }
        args.push(v);
      }
    }
    return f(...args);
  }

  start() {
    Service.getAvailablePort(this.startPort, this.endPort).then(port => {
      const addr = `0.0.0.0:${port}`;
      this.server.bind(addr, grpc.ServerCredentials.createInsecure());

      // go-plugin awaits this reply on stdout
      console.log(`1|1|tcp|${addr}|grpc`);

      process.stderr.write(`using address ${addr}\n`);
      this.server.start();
    });
  }

  private registerHealthCheck(): void {
    const serviceName = 'auth.Authenticator';
    const healthCheckStatusMap = {serviceName: HealthCheckResponse.ServingStatus.UNKNOWN};

    // Register the health service
    const grpcHealthCheck = new GrpcHealthCheck(healthCheckStatusMap);
    grpcHealthCheck.setStatus(serviceName, HealthCheckResponse.ServingStatus.SERVING);

    this.server.addService(HealthService, grpcHealthCheck);
  }

  private static paramNamePattern = new RegExp('^(?:function(?:\\s+\\w+)?\\s*)?\\(([^)]*)\\)', 'm');

  private static parameterNames(s: StateProducer): string[] {
    // @ts-ignore
    return s.toString().match(Service.paramNamePattern)[1].split(',').map(v => v.trim());
  }
}
