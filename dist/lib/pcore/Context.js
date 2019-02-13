"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("./Util");
const wellknownTypes = {
    Boolean: Util_1.makeBoolean,
    Integer: Util_1.makeInt,
    Float: Util_1.makeFloat,
    Number: Util_1.makeFloat,
    String: Util_1.makeString,
};
/**
 * Maps constructors to names of types
 */
class TypeNames {
    constructor(base) {
        const tn = new Map();
        TypeNames.createTypeMap(null, base, tn);
        this.typeMap = tn;
    }
    nameForType(type) {
        return this.typeMap.get(type);
    }
    static createTypeMap(ns, base, map) {
        if (base === null) {
            return;
        }
        if (ns !== null && typeof base === 'function') {
            map.set(base, ns);
            return;
        }
        if (typeof base === 'object') {
            for (const key in base) {
                if (key.match(/^[A-Z]/)) {
                    TypeNames.createTypeMap(ns === null ? key : ns + '::' + key, base[key], map);
                }
            }
        }
    }
}
exports.TypeNames = TypeNames;
class Context {
    constructor(nsBase, logger) {
        this.nsBase = nsBase;
        this.typeNames = new TypeNames(nsBase);
        this.logger = logger;
    }
    /**
     * Parse a double-colon separated type name and return the
     * corresponding constructor for the type
     *
     * @param typeString
     */
    parseType(typeString) {
        const parts = typeString.split('::');
        if (parts.length === 1) {
            // Check if well known type
            const t = wellknownTypes[parts[0]];
            if (t !== undefined) {
                return t;
            }
        }
        let c = this.nsBase;
        for (const part of parts) {
            c = c === null ? undefined : c[part];
            if (c === undefined) {
                break;
            }
        }
        if (c === undefined || typeof c !== 'function') {
            // Not a function, so not a constructor
            return undefined;
        }
        return c;
    }
    createInstance(type, value) {
        const tf = () => { };
        tf.prototype = type.prototype;
        const inst = new tf();
        if (Util_1.isHash(value)) {
            const ks = Object.keys(value);
            if (ks.length === 0) {
                return inst;
            }
            if (type.prototype.__ptype !== undefined) {
                type.apply(inst, [value]);
            }
            else {
                type.apply(inst, ks.map(k => value[k]));
            }
            return inst;
        }
        type.apply(inst, [value]);
        return inst;
    }
}
exports.Context = Context;
//# sourceMappingURL=Context.js.map