import { StringHash, Value } from '../pcore/Util';
import { Definition, ServiceBuilder } from './ServiceBuilder';
export declare class ManifestService {
    private readonly callables;
    private readonly definitions;
    private readonly stateFunctions;
    constructor(sb: ServiceBuilder);
    invoke(identifier: string, name: string, args: Value[]): Value;
    metadata(): [Value, Definition[]];
    state(name: string, input: StringHash): Value;
}
