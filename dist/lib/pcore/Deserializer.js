"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collector_1 = require("./Collector");
const Sensitive_1 = require("./Sensitive");
const Serializer_1 = require("./Serializer");
const Util_1 = require("./Util");
class Deserializer extends Collector_1.MemCollector {
    constructor(ctx, options) {
        super();
        this.allowUnresolved = !!options.allow_unresolved;
        this.context = ctx;
        this.converted = new Map();
    }
    value() {
        if (this.val === undefined) {
            this.val = this.convert(super.value());
        }
        return this.val;
    }
    convert(value) {
        const v = this.converted.get(value);
        if (v !== undefined) {
            return v;
        }
        if (Util_1.isStringMap(value)) {
            const pcoreType = value.get(Serializer_1.PTYPE_KEY);
            if (pcoreType !== undefined) {
                switch (pcoreType) {
                    case 'Hash':
                        return this.convertHash(value);
                    case 'Sensitive':
                        return this.convertSensitive(value);
                    case 'Default':
                        return Serializer_1.DEFAULT;
                }
                return this.convertOther(value, pcoreType);
            }
        }
    }
    convertHash(hash) {
        const value = hash.get(Serializer_1.PVALUE_KEY);
        const result = new Map();
        this.converted.set(hash, result);
        for (let idx = 0; idx < value.length; idx += 2) {
            result.set(this.convert(value[idx]), this.convert(value[idx + 1]));
        }
        return result;
    }
    convertSensitive(hash) {
        const v = hash.get(Serializer_1.PVALUE_KEY);
        if (v === undefined) {
            throw new Error('missing required __pvalue key');
        }
        const sv = new Sensitive_1.Sensitive(this.convert(v));
        this.converted.set(hash, sv);
        return sv;
    }
    convertOther(hash, pcoreType) {
        let value = hash.get(Serializer_1.PVALUE_KEY);
        if (value === undefined) {
            hash.delete(Serializer_1.PTYPE_KEY);
            value = hash;
        }
        if (pcoreType instanceof Map) {
            // Type deserialization is not supported in typescript
            throw Error('Deserialization of types is not supported');
        }
        const typ = this.context.parseType(pcoreType);
        if (typ === undefined) {
            if (this.allowUnresolved) {
                return value;
            }
            throw Error(`Deserialization of value of unknown type ${pcoreType}`);
        }
        return this.context.createInstance(typ, value);
    }
}
exports.Deserializer = Deserializer;
//# sourceMappingURL=Deserializer.js.map