import * as grpc from 'grpc';
import {sendUnaryData, ServerUnaryCall} from 'grpc';
import * as health from 'grpc-health-check/health';
import * as net from 'net';

import {Data} from '../../generated/datapb/data_pb';
import {toData} from '../datapb/reflect';
import {Context} from '../pcore/Context';
import {Deserializer} from '../pcore/Deserializer';
import {StreamLogger} from '../pcore/Logger';
import {consumePBData, ProtoConsumer} from '../pcore/ProtoConsumer';
import {Serializer} from '../pcore/Serializer';
import {Type} from '../pcore/Type';
import {Namespace, TypedName} from '../pcore/TypedName';
import {Value} from '../pcore/Util';
import {DefinitionServiceService} from '../servicepb/service_grpc_pb';
import {EmptyRequest, InvokeRequest, MetadataResponse, StateRequest} from '../servicepb/service_pb';

import {ManifestLoader} from './ManifestLoader';
import {Definition} from './ServiceBuilder';

export class Service {
  readonly serviceId: TypedName;
  readonly callables: {[s: string]: object};
  private readonly server: grpc.Server;
  private readonly startPort: number;
  private readonly endPort: number;
  private readonly context: Context;
  private readonly definitions: Definition[];

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

  private static fromData(ctx: Context, value: Data): Value {
    const consumer = new Deserializer(ctx, {});
    consumePBData(value, consumer);
    return consumer.value();
  }

  constructor(nsBase: {}, serviceId: TypedName, startPort: number, endPort: number) {
    this.server = new grpc.Server();
    this.serviceId = serviceId;
    this.startPort = startPort;
    this.endPort = endPort;
    this.context = new Context(nsBase, new StreamLogger(process.stderr));

    this.callables = {'JS::ManifestLoader': new ManifestLoader(this)};
    this.definitions = [new Definition(
        this.serviceId, new TypedName(Namespace.NsDefinition, 'JS::ManifestLoader'),
        {interface: new Type('Service::Service'), style: 'callable'})];

    this.server.addService(health.service, new health.Implementation({plugin: 'SERVING'}));

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
        const c = this.callables[rq.getIdentifier()];
        if (c === undefined) {
          throw new Error(`Unable to find implementation of ${rq.getIdentifier()}`);
        }
        const m = c[rq.getMethod()];
        if (m === undefined) {
          throw new Error(`Implementation of ${rq.getIdentifier()} has no method named ${rq.getMethod()}`);
        }
        callback(null, Service.toData(this.context, m(...args)));
      },

      metadata: (call: ServerUnaryCall<EmptyRequest>, callback: sendUnaryData<MetadataResponse>) => {
        const mdr = new MetadataResponse();
        mdr.setDefinitions(Service.toData(this.context, this.definitions));
        callback(null, mdr);
      },

      state: (call: ServerUnaryCall<StateRequest>) => {
        throw new Error(`Request for unknown state ${call.request.getIdentifier()}`);
      }
    });
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
}
