// package: puppet.fsm
// file: fsmpb/fsm.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as fsmpb_fsm_pb from "../fsmpb/fsm_pb";
import * as datapb_data_pb from "../datapb/data_pb";

interface IActorService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getActions: IActorService_IGetActions;
    invokeAction: IActorService_IInvokeAction;
}

interface IActorService_IGetActions extends grpc.MethodDefinition<fsmpb_fsm_pb.ActionsRequest, fsmpb_fsm_pb.ActionsResponse> {
    path: string; // "/puppet.fsm.Actor/GetActions"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<fsmpb_fsm_pb.ActionsRequest>;
    requestDeserialize: grpc.deserialize<fsmpb_fsm_pb.ActionsRequest>;
    responseSerialize: grpc.serialize<fsmpb_fsm_pb.ActionsResponse>;
    responseDeserialize: grpc.deserialize<fsmpb_fsm_pb.ActionsResponse>;
}
interface IActorService_IInvokeAction extends grpc.MethodDefinition<fsmpb_fsm_pb.ActionMessage, fsmpb_fsm_pb.ActionMessage> {
    path: string; // "/puppet.fsm.Actor/InvokeAction"
    requestStream: boolean; // true
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<fsmpb_fsm_pb.ActionMessage>;
    requestDeserialize: grpc.deserialize<fsmpb_fsm_pb.ActionMessage>;
    responseSerialize: grpc.serialize<fsmpb_fsm_pb.ActionMessage>;
    responseDeserialize: grpc.deserialize<fsmpb_fsm_pb.ActionMessage>;
}

export const ActorService: IActorService;

export interface IActorServer {
    getActions: grpc.handleUnaryCall<fsmpb_fsm_pb.ActionsRequest, fsmpb_fsm_pb.ActionsResponse>;
    invokeAction: grpc.handleBidiStreamingCall<fsmpb_fsm_pb.ActionMessage, fsmpb_fsm_pb.ActionMessage>;
}

export interface IActorClient {
    getActions(request: fsmpb_fsm_pb.ActionsRequest, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    getActions(request: fsmpb_fsm_pb.ActionsRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    getActions(request: fsmpb_fsm_pb.ActionsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    invokeAction(): grpc.ClientDuplexStream<fsmpb_fsm_pb.ActionMessage, fsmpb_fsm_pb.ActionMessage>;
    invokeAction(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<fsmpb_fsm_pb.ActionMessage, fsmpb_fsm_pb.ActionMessage>;
    invokeAction(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<fsmpb_fsm_pb.ActionMessage, fsmpb_fsm_pb.ActionMessage>;
}

export class ActorClient extends grpc.Client implements IActorClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getActions(request: fsmpb_fsm_pb.ActionsRequest, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    public getActions(request: fsmpb_fsm_pb.ActionsRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    public getActions(request: fsmpb_fsm_pb.ActionsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    public invokeAction(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<fsmpb_fsm_pb.ActionMessage, fsmpb_fsm_pb.ActionMessage>;
    public invokeAction(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<fsmpb_fsm_pb.ActionMessage, fsmpb_fsm_pb.ActionMessage>;
}
