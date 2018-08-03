// package: puppet.fsm
// file: fsmpb/fsm.proto

/* tslint:disable */

import * as jspb from "google-protobuf";
import * as datapb_data_pb from "../datapb/data_pb";

export class ActionsRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ActionsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ActionsRequest): ActionsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ActionsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ActionsRequest;
    static deserializeBinaryFromReader(message: ActionsRequest, reader: jspb.BinaryReader): ActionsRequest;
}

export namespace ActionsRequest {
    export type AsObject = {
    }
}

export class ActionsResponse extends jspb.Message { 
    clearActionsList(): void;
    getActionsList(): Array<Action>;
    setActionsList(value: Array<Action>): void;
    addActions(value?: Action, index?: number): Action;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ActionsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ActionsResponse): ActionsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ActionsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ActionsResponse;
    static deserializeBinaryFromReader(message: ActionsResponse, reader: jspb.BinaryReader): ActionsResponse;
}

export namespace ActionsResponse {
    export type AsObject = {
        actionsList: Array<Action.AsObject>,
    }
}

export class ActionInvocation extends jspb.Message { 
    getGenesis(): number;
    setGenesis(value: number): void;

    getId(): number;
    setId(value: number): void;


    hasArguments(): boolean;
    clearArguments(): void;
    getArguments(): datapb_data_pb.DataHash | undefined;
    setArguments(value?: datapb_data_pb.DataHash): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ActionInvocation.AsObject;
    static toObject(includeInstance: boolean, msg: ActionInvocation): ActionInvocation.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ActionInvocation, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ActionInvocation;
    static deserializeBinaryFromReader(message: ActionInvocation, reader: jspb.BinaryReader): ActionInvocation;
}

export namespace ActionInvocation {
    export type AsObject = {
        genesis: number,
        id: number,
        arguments?: datapb_data_pb.DataHash.AsObject,
    }
}

export class Parameter extends jspb.Message { 
    getName(): string;
    setName(value: string): void;

    getType(): string;
    setType(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Parameter.AsObject;
    static toObject(includeInstance: boolean, msg: Parameter): Parameter.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Parameter, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Parameter;
    static deserializeBinaryFromReader(message: Parameter, reader: jspb.BinaryReader): Parameter;
}

export namespace Parameter {
    export type AsObject = {
        name: string,
        type: string,
    }
}

export class Action extends jspb.Message { 
    getId(): number;
    setId(value: number): void;

    getName(): string;
    setName(value: string): void;

    clearConsumesList(): void;
    getConsumesList(): Array<Parameter>;
    setConsumesList(value: Array<Parameter>): void;
    addConsumes(value?: Parameter, index?: number): Parameter;

    clearProducesList(): void;
    getProducesList(): Array<Parameter>;
    setProducesList(value: Array<Parameter>): void;
    addProduces(value?: Parameter, index?: number): Parameter;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Action.AsObject;
    static toObject(includeInstance: boolean, msg: Action): Action.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Action, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Action;
    static deserializeBinaryFromReader(message: Action, reader: jspb.BinaryReader): Action;
}

export namespace Action {
    export type AsObject = {
        id: number,
        name: string,
        consumesList: Array<Parameter.AsObject>,
        producesList: Array<Parameter.AsObject>,
    }
}
