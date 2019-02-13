// package: puppet.datapb
// file: datapb/data.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class DataHash extends jspb.Message { 
    clearEntriesList(): void;
    getEntriesList(): Array<DataEntry>;
    setEntriesList(value: Array<DataEntry>): void;
    addEntries(value?: DataEntry, index?: number): DataEntry;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataHash.AsObject;
    static toObject(includeInstance: boolean, msg: DataHash): DataHash.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataHash, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataHash;
    static deserializeBinaryFromReader(message: DataHash, reader: jspb.BinaryReader): DataHash;
}

export namespace DataHash {
    export type AsObject = {
        entriesList: Array<DataEntry.AsObject>,
    }
}

export class DataEntry extends jspb.Message { 

    hasKey(): boolean;
    clearKey(): void;
    getKey(): Data | undefined;
    setKey(value?: Data): void;


    hasValue(): boolean;
    clearValue(): void;
    getValue(): Data | undefined;
    setValue(value?: Data): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataEntry.AsObject;
    static toObject(includeInstance: boolean, msg: DataEntry): DataEntry.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataEntry;
    static deserializeBinaryFromReader(message: DataEntry, reader: jspb.BinaryReader): DataEntry;
}

export namespace DataEntry {
    export type AsObject = {
        key?: Data.AsObject,
        value?: Data.AsObject,
    }
}

export class Data extends jspb.Message { 

    hasUndefValue(): boolean;
    clearUndefValue(): void;
    getUndefValue(): NullValue;
    setUndefValue(value: NullValue): void;


    hasIntegerValue(): boolean;
    clearIntegerValue(): void;
    getIntegerValue(): number;
    setIntegerValue(value: number): void;


    hasFloatValue(): boolean;
    clearFloatValue(): void;
    getFloatValue(): number;
    setFloatValue(value: number): void;


    hasStringValue(): boolean;
    clearStringValue(): void;
    getStringValue(): string;
    setStringValue(value: string): void;


    hasBooleanValue(): boolean;
    clearBooleanValue(): void;
    getBooleanValue(): boolean;
    setBooleanValue(value: boolean): void;


    hasHashValue(): boolean;
    clearHashValue(): void;
    getHashValue(): DataHash | undefined;
    setHashValue(value?: DataHash): void;


    hasArrayValue(): boolean;
    clearArrayValue(): void;
    getArrayValue(): DataArray | undefined;
    setArrayValue(value?: DataArray): void;


    hasBinaryValue(): boolean;
    clearBinaryValue(): void;
    getBinaryValue(): Uint8Array | string;
    getBinaryValue_asU8(): Uint8Array;
    getBinaryValue_asB64(): string;
    setBinaryValue(value: Uint8Array | string): void;


    hasReference(): boolean;
    clearReference(): void;
    getReference(): number;
    setReference(value: number): void;


    getKindCase(): Data.KindCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Data.AsObject;
    static toObject(includeInstance: boolean, msg: Data): Data.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Data, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Data;
    static deserializeBinaryFromReader(message: Data, reader: jspb.BinaryReader): Data;
}

export namespace Data {
    export type AsObject = {
        undefValue: NullValue,
        integerValue: number,
        floatValue: number,
        stringValue: string,
        booleanValue: boolean,
        hashValue?: DataHash.AsObject,
        arrayValue?: DataArray.AsObject,
        binaryValue: Uint8Array | string,
        reference: number,
    }

    export enum KindCase {
        KIND_NOT_SET = 0,
    
    UNDEF_VALUE = 1,

    INTEGER_VALUE = 2,

    FLOAT_VALUE = 3,

    STRING_VALUE = 4,

    BOOLEAN_VALUE = 5,

    HASH_VALUE = 6,

    ARRAY_VALUE = 7,

    BINARY_VALUE = 8,

    REFERENCE = 9,

    }

}

export class DataArray extends jspb.Message { 
    clearValuesList(): void;
    getValuesList(): Array<Data>;
    setValuesList(value: Array<Data>): void;
    addValues(value?: Data, index?: number): Data;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataArray.AsObject;
    static toObject(includeInstance: boolean, msg: DataArray): DataArray.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataArray, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataArray;
    static deserializeBinaryFromReader(message: DataArray, reader: jspb.BinaryReader): DataArray;
}

export namespace DataArray {
    export type AsObject = {
        valuesList: Array<Data.AsObject>,
    }
}

export enum NullValue {
    NULL_VALUE = 0,
}
