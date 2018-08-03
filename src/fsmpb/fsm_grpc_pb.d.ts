// package: puppet.fsm
// file: fsmpb/fsm.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as fsmpb_fsm_pb from "../fsmpb/fsm_pb";
import * as datapb_data_pb from "../datapb/data_pb";

interface IGenesisService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    apply: IGenesisService_Iapply;
}

interface IGenesisService_Iapply extends grpc.MethodDefinition<datapb_data_pb.DataHash, datapb_data_pb.DataHash> {
    path: string; // "/puppet.fsm.Genesis/apply"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<datapb_data_pb.DataHash>;
    requestDeserialize: grpc.deserialize<datapb_data_pb.DataHash>;
    responseSerialize: grpc.serialize<datapb_data_pb.DataHash>;
    responseDeserialize: grpc.deserialize<datapb_data_pb.DataHash>;
}

export const GenesisService: IGenesisService;

export interface IGenesisServer {
    apply: grpc.handleUnaryCall<datapb_data_pb.DataHash, datapb_data_pb.DataHash>;
}

export interface IGenesisClient {
    apply(request: datapb_data_pb.DataHash, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
    apply(request: datapb_data_pb.DataHash, metadata: grpc.Metadata, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
    apply(request: datapb_data_pb.DataHash, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
}

export class GenesisClient extends grpc.Client implements IGenesisClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public apply(request: datapb_data_pb.DataHash, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
    public apply(request: datapb_data_pb.DataHash, metadata: grpc.Metadata, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
    public apply(request: datapb_data_pb.DataHash, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
}

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
interface IActorService_IInvokeAction extends grpc.MethodDefinition<fsmpb_fsm_pb.ActionInvocation, datapb_data_pb.DataHash> {
    path: string; // "/puppet.fsm.Actor/InvokeAction"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<fsmpb_fsm_pb.ActionInvocation>;
    requestDeserialize: grpc.deserialize<fsmpb_fsm_pb.ActionInvocation>;
    responseSerialize: grpc.serialize<datapb_data_pb.DataHash>;
    responseDeserialize: grpc.deserialize<datapb_data_pb.DataHash>;
}

export const ActorService: IActorService;

export interface IActorServer {
    getActions: grpc.handleUnaryCall<fsmpb_fsm_pb.ActionsRequest, fsmpb_fsm_pb.ActionsResponse>;
    invokeAction: grpc.handleUnaryCall<fsmpb_fsm_pb.ActionInvocation, datapb_data_pb.DataHash>;
}

export interface IActorClient {
    getActions(request: fsmpb_fsm_pb.ActionsRequest, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    getActions(request: fsmpb_fsm_pb.ActionsRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    getActions(request: fsmpb_fsm_pb.ActionsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    invokeAction(request: fsmpb_fsm_pb.ActionInvocation, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
    invokeAction(request: fsmpb_fsm_pb.ActionInvocation, metadata: grpc.Metadata, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
    invokeAction(request: fsmpb_fsm_pb.ActionInvocation, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
}

export class ActorClient extends grpc.Client implements IActorClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getActions(request: fsmpb_fsm_pb.ActionsRequest, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    public getActions(request: fsmpb_fsm_pb.ActionsRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    public getActions(request: fsmpb_fsm_pb.ActionsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: fsmpb_fsm_pb.ActionsResponse) => void): grpc.ClientUnaryCall;
    public invokeAction(request: fsmpb_fsm_pb.ActionInvocation, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
    public invokeAction(request: fsmpb_fsm_pb.ActionInvocation, metadata: grpc.Metadata, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
    public invokeAction(request: fsmpb_fsm_pb.ActionInvocation, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: datapb_data_pb.DataHash) => void): grpc.ClientUnaryCall;
}
