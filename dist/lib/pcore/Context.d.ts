import { Logger } from './Logger';
import { StringHash, Value } from './Util';
/**
 * Maps constructors to names of types
 */
export declare class TypeNames {
    private typeMap;
    constructor(base: {});
    nameForType(type: Function): string | undefined;
    private static createTypeMap;
}
export declare class Context {
    private readonly nsBase;
    readonly logger: Logger;
    readonly typeNames: TypeNames;
    constructor(nsBase: StringHash, logger: Logger);
    /**
     * Parse a double-colon separated type name and return the
     * corresponding constructor for the type
     *
     * @param typeString
     */
    parseType(typeString: string): Function | undefined;
    createInstance(type: Function, value: Value): Value;
}
