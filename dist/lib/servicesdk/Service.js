"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const health = require("grpc-health-check/health");
const net = require("net");
const reflect_1 = require("../datapb/reflect");
const Context_1 = require("../pcore/Context");
const Deserializer_1 = require("../pcore/Deserializer");
const Logger_1 = require("../pcore/Logger");
const ProtoConsumer_1 = require("../pcore/ProtoConsumer");
const Serializer_1 = require("../pcore/Serializer");
const Type_1 = require("../pcore/Type");
const TypedName_1 = require("../pcore/TypedName");
const service_grpc_pb_1 = require("../servicepb/service_grpc_pb");
const service_pb_1 = require("../servicepb/service_pb");
const ManifestLoader_1 = require("./ManifestLoader");
const ServiceBuilder_1 = require("./ServiceBuilder");
class Service {
    static getAvailablePort(start, end) {
        function getNextAvailablePort(currentPort, resolve, reject) {
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
                }
                else {
                    getNextAvailablePort(++currentPort, resolve, reject);
                }
            });
        }
        return new Promise((resolve, reject) => {
            getNextAvailablePort(start, resolve, reject);
        });
    }
    static toData(ctx, value) {
        const consumer = new ProtoConsumer_1.ProtoConsumer();
        const ser = new Serializer_1.Serializer(ctx, {});
        ser.convert(value, consumer);
        return consumer.value();
    }
    static fromData(ctx, value) {
        const consumer = new Deserializer_1.Deserializer(ctx, {});
        ProtoConsumer_1.consumePBData(value, consumer);
        return consumer.value();
    }
    constructor(nsBase, serviceId, startPort, endPort) {
        this.server = new grpc.Server();
        this.serviceId = serviceId;
        this.startPort = startPort;
        this.endPort = endPort;
        this.context = new Context_1.Context(nsBase, new Logger_1.StreamLogger(process.stderr));
        this.callables = { 'JS::ManifestLoader': new ManifestLoader_1.ManifestLoader(this) };
        this.definitions = [new ServiceBuilder_1.Definition(this.serviceId, new TypedName_1.TypedName(TypedName_1.Namespace.NsDefinition, 'JS::ManifestLoader'), { interface: new Type_1.Type('Service::Service'), style: 'callable' })];
        this.server.addService(health.service, new health.Implementation({ plugin: 'SERVING' }));
        this.server.addService(service_grpc_pb_1.DefinitionServiceService, {
            identity: (call, callback) => callback(null, Service.toData(this.context, this.serviceId)),
            invoke: (call, callback) => {
                const rq = call.request;
                let ra = rq.getArguments();
                if (ra === undefined) {
                    ra = reflect_1.toData(null);
                }
                const args = Service.fromData(this.context, ra);
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
            metadata: (call, callback) => {
                const mdr = new service_pb_1.MetadataResponse();
                mdr.setDefinitions(Service.toData(this.context, this.definitions));
                callback(null, mdr);
            },
            state: (call) => {
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
exports.Service = Service;
//# sourceMappingURL=Service.js.map