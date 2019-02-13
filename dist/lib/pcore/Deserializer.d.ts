import { Value } from 'google-protobuf/google/protobuf/struct_pb';
import { MemCollector } from './Collector';
import { Context } from './Context';
export declare class Deserializer extends MemCollector {
    private readonly allowUnresolved;
    private readonly context;
    private readonly converted;
    private val;
    constructor(ctx: Context, options: {
        allow_unresolved?: boolean;
    });
    value(): Value;
    private convert;
    private convertHash;
    private convertSensitive;
    private convertOther;
}
