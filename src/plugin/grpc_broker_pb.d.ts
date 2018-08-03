// package: plugin
// file: grpc_broker.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class ConnInfo extends jspb.Message { 
    getServiceId(): number;
    setServiceId(value: number): void;

    getNetwork(): string;
    setNetwork(value: string): void;

    getAddress(): string;
    setAddress(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConnInfo.AsObject;
    static toObject(includeInstance: boolean, msg: ConnInfo): ConnInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConnInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConnInfo;
    static deserializeBinaryFromReader(message: ConnInfo, reader: jspb.BinaryReader): ConnInfo;
}

export namespace ConnInfo {
    export type AsObject = {
        serviceId: number,
        network: string,
        address: string,
    }
}
