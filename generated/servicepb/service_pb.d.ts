// package: puppet.service
// file: servicepb/service.proto

/* tslint:disable */

import * as jspb from "google-protobuf";
import * as datapb_data_pb from "../datapb/data_pb";

export class MetadataResponse extends jspb.Message { 

    hasTypeset(): boolean;
    clearTypeset(): void;
    getTypeset(): datapb_data_pb.Data | undefined;
    setTypeset(value?: datapb_data_pb.Data): void;


    hasDefinitions(): boolean;
    clearDefinitions(): void;
    getDefinitions(): datapb_data_pb.Data | undefined;
    setDefinitions(value?: datapb_data_pb.Data): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MetadataResponse.AsObject;
    static toObject(includeInstance: boolean, msg: MetadataResponse): MetadataResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MetadataResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MetadataResponse;
    static deserializeBinaryFromReader(message: MetadataResponse, reader: jspb.BinaryReader): MetadataResponse;
}

export namespace MetadataResponse {
    export type AsObject = {
        typeset?: datapb_data_pb.Data.AsObject,
        definitions?: datapb_data_pb.Data.AsObject,
    }
}

export class InvokeRequest extends jspb.Message { 
    getIdentifier(): string;
    setIdentifier(value: string): void;

    getMethod(): string;
    setMethod(value: string): void;


    hasArguments(): boolean;
    clearArguments(): void;
    getArguments(): datapb_data_pb.Data | undefined;
    setArguments(value?: datapb_data_pb.Data): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InvokeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: InvokeRequest): InvokeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InvokeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InvokeRequest;
    static deserializeBinaryFromReader(message: InvokeRequest, reader: jspb.BinaryReader): InvokeRequest;
}

export namespace InvokeRequest {
    export type AsObject = {
        identifier: string,
        method: string,
        arguments?: datapb_data_pb.Data.AsObject,
    }
}

export class EmptyRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EmptyRequest.AsObject;
    static toObject(includeInstance: boolean, msg: EmptyRequest): EmptyRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EmptyRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EmptyRequest;
    static deserializeBinaryFromReader(message: EmptyRequest, reader: jspb.BinaryReader): EmptyRequest;
}

export namespace EmptyRequest {
    export type AsObject = {
    }
}

export class StateRequest extends jspb.Message { 
    getIdentifier(): string;
    setIdentifier(value: string): void;


    hasParameters(): boolean;
    clearParameters(): void;
    getParameters(): datapb_data_pb.Data | undefined;
    setParameters(value?: datapb_data_pb.Data): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: StateRequest): StateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StateRequest;
    static deserializeBinaryFromReader(message: StateRequest, reader: jspb.BinaryReader): StateRequest;
}

export namespace StateRequest {
    export type AsObject = {
        identifier: string,
        parameters?: datapb_data_pb.Data.AsObject,
    }
}
