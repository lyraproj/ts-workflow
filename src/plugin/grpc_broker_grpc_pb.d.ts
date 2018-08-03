// package: plugin
// file: grpc_broker.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as grpc_broker_pb from "./grpc_broker_pb";

interface IGRPCBrokerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    startStream: IGRPCBrokerService_IStartStream;
}

interface IGRPCBrokerService_IStartStream extends grpc.MethodDefinition<grpc_broker_pb.ConnInfo, grpc_broker_pb.ConnInfo> {
    path: string; // "/plugin.GRPCBroker/StartStream"
    requestStream: boolean; // true
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<grpc_broker_pb.ConnInfo>;
    requestDeserialize: grpc.deserialize<grpc_broker_pb.ConnInfo>;
    responseSerialize: grpc.serialize<grpc_broker_pb.ConnInfo>;
    responseDeserialize: grpc.deserialize<grpc_broker_pb.ConnInfo>;
}

export const GRPCBrokerService: IGRPCBrokerService;

export interface IGRPCBrokerServer {
    startStream: grpc.handleBidiStreamingCall<grpc_broker_pb.ConnInfo, grpc_broker_pb.ConnInfo>;
}

export interface IGRPCBrokerClient {
    startStream(): grpc.ClientDuplexStream<grpc_broker_pb.ConnInfo, grpc_broker_pb.ConnInfo>;
    startStream(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<grpc_broker_pb.ConnInfo, grpc_broker_pb.ConnInfo>;
    startStream(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<grpc_broker_pb.ConnInfo, grpc_broker_pb.ConnInfo>;
}

export class GRPCBrokerClient extends grpc.Client implements IGRPCBrokerClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public startStream(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<grpc_broker_pb.ConnInfo, grpc_broker_pb.ConnInfo>;
    public startStream(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<grpc_broker_pb.ConnInfo, grpc_broker_pb.ConnInfo>;
}
