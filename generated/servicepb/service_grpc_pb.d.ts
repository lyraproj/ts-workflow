// package: puppet.service
// file: servicepb/service.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as servicepb_service_pb from "../servicepb/service_pb";
import * as datapb_data_pb from "../datapb/data_pb";

interface IDefinitionServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    identity: IDefinitionServiceService_IIdentity;
    invoke: IDefinitionServiceService_IInvoke;
    metadata: IDefinitionServiceService_IMetadata;
    state: IDefinitionServiceService_IState;
}

interface IDefinitionServiceService_IIdentity extends grpc.MethodDefinition<servicepb_service_pb.EmptyRequest, datapb_data_pb.Data> {
    path: string; // "/puppet.service.DefinitionService/Identity"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<servicepb_service_pb.EmptyRequest>;
    requestDeserialize: grpc.deserialize<servicepb_service_pb.EmptyRequest>;
    responseSerialize: grpc.serialize<datapb_data_pb.Data>;
    responseDeserialize: grpc.deserialize<datapb_data_pb.Data>;
}
interface IDefinitionServiceService_IInvoke extends grpc.MethodDefinition<servicepb_service_pb.InvokeRequest, datapb_data_pb.Data> {
    path: string; // "/puppet.service.DefinitionService/Invoke"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<servicepb_service_pb.InvokeRequest>;
    requestDeserialize: grpc.deserialize<servicepb_service_pb.InvokeRequest>;
    responseSerialize: grpc.serialize<datapb_data_pb.Data>;
    responseDeserialize: grpc.deserialize<datapb_data_pb.Data>;
}
interface IDefinitionServiceService_IMetadata extends grpc.MethodDefinition<servicepb_service_pb.EmptyRequest, servicepb_service_pb.MetadataResponse> {
    path: string; // "/puppet.service.DefinitionService/Metadata"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<servicepb_service_pb.EmptyRequest>;
    requestDeserialize: grpc.deserialize<servicepb_service_pb.EmptyRequest>;
    responseSerialize: grpc.serialize<servicepb_service_pb.MetadataResponse>;
    responseDeserialize: grpc.deserialize<servicepb_service_pb.MetadataResponse>;
}
interface IDefinitionServiceService_IState extends grpc.MethodDefinition<servicepb_service_pb.StateRequest, datapb_data_pb.Data> {
    path: string; // "/puppet.service.DefinitionService/State"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<servicepb_service_pb.StateRequest>;
    requestDeserialize: grpc.deserialize<servicepb_service_pb.StateRequest>;
    responseSerialize: grpc.serialize<datapb_data_pb.Data>;
    responseDeserialize: grpc.deserialize<datapb_data_pb.Data>;
}

export const DefinitionServiceService: IDefinitionServiceService;

export interface IDefinitionServiceServer {
    identity: grpc.handleUnaryCall<servicepb_service_pb.EmptyRequest, datapb_data_pb.Data>;
    invoke: grpc.handleUnaryCall<servicepb_service_pb.InvokeRequest, datapb_data_pb.Data>;
    metadata: grpc.handleUnaryCall<servicepb_service_pb.EmptyRequest, servicepb_service_pb.MetadataResponse>;
    state: grpc.handleUnaryCall<servicepb_service_pb.StateRequest, datapb_data_pb.Data>;
}

export interface IDefinitionServiceClient {
    identity(request: servicepb_service_pb.EmptyRequest, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    identity(request: servicepb_service_pb.EmptyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    identity(request: servicepb_service_pb.EmptyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    invoke(request: servicepb_service_pb.InvokeRequest, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    invoke(request: servicepb_service_pb.InvokeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    invoke(request: servicepb_service_pb.InvokeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    metadata(request: servicepb_service_pb.EmptyRequest, callback: (error: grpc.ServiceError | null, response: servicepb_service_pb.MetadataResponse) => void): grpc.ClientUnaryCall;
    metadata(request: servicepb_service_pb.EmptyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: servicepb_service_pb.MetadataResponse) => void): grpc.ClientUnaryCall;
    metadata(request: servicepb_service_pb.EmptyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: servicepb_service_pb.MetadataResponse) => void): grpc.ClientUnaryCall;
    state(request: servicepb_service_pb.StateRequest, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    state(request: servicepb_service_pb.StateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    state(request: servicepb_service_pb.StateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
}

export class DefinitionServiceClient extends grpc.Client implements IDefinitionServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public identity(request: servicepb_service_pb.EmptyRequest, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    public identity(request: servicepb_service_pb.EmptyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    public identity(request: servicepb_service_pb.EmptyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    public invoke(request: servicepb_service_pb.InvokeRequest, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    public invoke(request: servicepb_service_pb.InvokeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    public invoke(request: servicepb_service_pb.InvokeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    public metadata(request: servicepb_service_pb.EmptyRequest, callback: (error: grpc.ServiceError | null, response: servicepb_service_pb.MetadataResponse) => void): grpc.ClientUnaryCall;
    public metadata(request: servicepb_service_pb.EmptyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: servicepb_service_pb.MetadataResponse) => void): grpc.ClientUnaryCall;
    public metadata(request: servicepb_service_pb.EmptyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: servicepb_service_pb.MetadataResponse) => void): grpc.ClientUnaryCall;
    public state(request: servicepb_service_pb.StateRequest, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    public state(request: servicepb_service_pb.StateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
    public state(request: servicepb_service_pb.StateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: datapb_data_pb.Data) => void): grpc.ClientUnaryCall;
}
