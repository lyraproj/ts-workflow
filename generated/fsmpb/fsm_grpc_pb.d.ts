// package: puppet.fsm
// file: fsmpb/fsm.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as fsmpb_fsm_pb from "../fsmpb/fsm_pb";
import * as datapb_data_pb from "../datapb/data_pb";

interface IActorsService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getActor: IActorsService_IGetActor;
    invokeAction: IActorsService_IInvokeAction;
}

interface IActorsService_IGetActor extends grpc.MethodDefinition<fsmpb_fsm_pb.ActorRequest, fsmpb_fsm_pb.Actor> {
    path: string; // "/puppet.fsm.Actors/GetActor"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<fsmpb_fsm_pb.ActorRequest>;
    requestDeserialize: grpc.deserialize<fsmpb_fsm_pb.ActorRequest>;
    responseSerialize: grpc.serialize<fsmpb_fsm_pb.Actor>;
    responseDeserialize: grpc.deserialize<fsmpb_fsm_pb.Actor>;
}
interface IActorsService_IInvokeAction extends grpc.MethodDefinition<fsmpb_fsm_pb.Message, fsmpb_fsm_pb.Message> {
    path: string; // "/puppet.fsm.Actors/InvokeAction"
    requestStream: boolean; // true
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<fsmpb_fsm_pb.Message>;
    requestDeserialize: grpc.deserialize<fsmpb_fsm_pb.Message>;
    responseSerialize: grpc.serialize<fsmpb_fsm_pb.Message>;
    responseDeserialize: grpc.deserialize<fsmpb_fsm_pb.Message>;
}

export const ActorsService: IActorsService;

export interface IActorsServer {
    getActor: grpc.handleUnaryCall<fsmpb_fsm_pb.ActorRequest, fsmpb_fsm_pb.Actor>;
    invokeAction: grpc.handleBidiStreamingCall<fsmpb_fsm_pb.Message, fsmpb_fsm_pb.Message>;
}

export interface IActorsClient {
    getActor(request: fsmpb_fsm_pb.ActorRequest, callback: (error: Error | null, response: fsmpb_fsm_pb.Actor) => void): grpc.ClientUnaryCall;
    getActor(request: fsmpb_fsm_pb.ActorRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: fsmpb_fsm_pb.Actor) => void): grpc.ClientUnaryCall;
    getActor(request: fsmpb_fsm_pb.ActorRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: fsmpb_fsm_pb.Actor) => void): grpc.ClientUnaryCall;
    invokeAction(): grpc.ClientDuplexStream<fsmpb_fsm_pb.Message, fsmpb_fsm_pb.Message>;
    invokeAction(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<fsmpb_fsm_pb.Message, fsmpb_fsm_pb.Message>;
    invokeAction(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<fsmpb_fsm_pb.Message, fsmpb_fsm_pb.Message>;
}

export class ActorsClient extends grpc.Client implements IActorsClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getActor(request: fsmpb_fsm_pb.ActorRequest, callback: (error: Error | null, response: fsmpb_fsm_pb.Actor) => void): grpc.ClientUnaryCall;
    public getActor(request: fsmpb_fsm_pb.ActorRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: fsmpb_fsm_pb.Actor) => void): grpc.ClientUnaryCall;
    public getActor(request: fsmpb_fsm_pb.ActorRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: fsmpb_fsm_pb.Actor) => void): grpc.ClientUnaryCall;
    public invokeAction(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<fsmpb_fsm_pb.Message, fsmpb_fsm_pb.Message>;
    public invokeAction(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<fsmpb_fsm_pb.Message, fsmpb_fsm_pb.Message>;
}
