// package: puppet.fsm
// file: fsmpb/fsm.proto

/* tslint:disable */

import * as jspb from "google-protobuf";
import * as datapb_data_pb from "../datapb/data_pb";

export class ActorRequest extends jspb.Message { 
    getName(): string;
    setName(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ActorRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ActorRequest): ActorRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ActorRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ActorRequest;
    static deserializeBinaryFromReader(message: ActorRequest, reader: jspb.BinaryReader): ActorRequest;
}

export namespace ActorRequest {
    export type AsObject = {
        name: string,
    }
}

export class Actor extends jspb.Message { 
    clearActionsList(): void;
    getActionsList(): Array<Action>;
    setActionsList(value: Array<Action>): void;
    addActions(value?: Action, index?: number): Action;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Actor.AsObject;
    static toObject(includeInstance: boolean, msg: Actor): Actor.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Actor, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Actor;
    static deserializeBinaryFromReader(message: Actor, reader: jspb.BinaryReader): Actor;
}

export namespace Actor {
    export type AsObject = {
        actionsList: Array<Action.AsObject>,
    }
}

export class Message extends jspb.Message { 
    getId(): number;
    setId(value: number): void;


    hasValue(): boolean;
    clearValue(): void;
    getValue(): datapb_data_pb.Data | undefined;
    setValue(value?: datapb_data_pb.Data): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Message.AsObject;
    static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Message;
    static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
    export type AsObject = {
        id: number,
        value?: datapb_data_pb.Data.AsObject,
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
    getName(): string;
    setName(value: string): void;

    clearInputList(): void;
    getInputList(): Array<Parameter>;
    setInputList(value: Array<Parameter>): void;
    addInput(value?: Parameter, index?: number): Parameter;

    clearOutputList(): void;
    getOutputList(): Array<Parameter>;
    setOutputList(value: Array<Parameter>): void;
    addOutput(value?: Parameter, index?: number): Parameter;


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
        name: string,
        inputList: Array<Parameter.AsObject>,
        outputList: Array<Parameter.AsObject>,
    }
}
