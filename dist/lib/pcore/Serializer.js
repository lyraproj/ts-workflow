"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sensitive_1 = require("./Sensitive");
const Util_1 = require("./Util");
exports.PTYPE_KEY = '__ptype';
exports.PVALUE_KEY = '__pvalue';
function isPcoreObject(value) {
    return value !== null && typeof value[exports.PTYPE_KEY] === 'function';
}
exports.isPcoreObject = isPcoreObject;
function isPcoreValue(value) {
    return value !== null && typeof value[exports.PVALUE_KEY] === 'function';
}
exports.isPcoreValue = isPcoreValue;
exports.DEFAULT = Symbol('default');
class Serializer {
    constructor(c, options) {
        this.context = c;
        this.dedupLevel = options.dedup_level === undefined ? 2 /* MaxDedup */ : options.dedup_level;
        this.richData = options.rich_data === undefined ? true : options.rich_data;
    }
    convert(value, consumer) {
        const c = new SerializerContext(this, consumer, this.dedupLevel >= 2 /* MaxDedup */ && !consumer.canDoComplexKeys() ? 1 /* NoKeyDedup */ :
            this.dedupLevel);
        c.toData(1, value);
    }
}
exports.Serializer = Serializer;
class SerializerContext {
    constructor(config, consumer, dedupLevel) {
        this.config = config;
        this.consumer = consumer;
        this.dedupLevel = dedupLevel;
        this.values = new Map();
        this.strings = {};
        this.path = [];
        this.refIndex = 0;
    }
    toData(level, value) {
        if (value === null || value === undefined) {
            this.addData(null);
            return;
        }
        switch (typeof value) {
            case 'number':
            case 'boolean':
                this.addData(value);
                break;
            case 'string':
                this.addString(level, value);
                break;
            case 'function':
                if (this.config.richData) {
                    // A constructor actually denotes a type
                    const tn = this.config.context.typeNames.nameForType(value);
                    if (tn === undefined) {
                        throw new Error(`${this.pathToString()}: unable to serialize function ${value}`);
                    }
                    this.process(value, () => this.addHash(1, () => {
                        this.addString(2, exports.PTYPE_KEY);
                        this.addString(1, tn);
                    }));
                }
                else {
                    this.unknownToStringWithWarning(level, value);
                }
                break;
            case 'object':
                switch (value.constructor) {
                    case Object:
                        this.process(value, () => {
                            const h = value;
                            const keys = Object.keys(h);
                            this.addHash(keys.length, () => {
                                for (const key in value) {
                                    if (value.hasOwnProperty(key)) {
                                        const prop = value[key];
                                        if (typeof prop !== 'function') {
                                            this.addString(2, key);
                                            this.withPath(key, () => this.toData(1, prop));
                                        }
                                    }
                                }
                            });
                        });
                        break;
                    case Map:
                        this.process(value, () => {
                            const h = value;
                            this.addHash(h.size, () => {
                                if (this.consumer.canDoComplexKeys() || Util_1.isStringMap(h)) {
                                    h.forEach((value, key) => {
                                        this.toData(2, key);
                                        this.withPath(key, () => this.toData(1, value));
                                    });
                                }
                                else {
                                    this.nonStringKeyedHashToData(h);
                                }
                            });
                        });
                        break;
                    case Array:
                        this.process(value, () => {
                            const arr = value;
                            this.addArray(arr.length, () => {
                                for (let idx = 0; idx < arr.length; idx++) {
                                    this.withPath(idx, () => this.toData(1, arr[idx]));
                                }
                            });
                        });
                        break;
                    case Date:
                        this.process(value, () => this.addHash(2, () => {
                            this.addString(2, exports.PTYPE_KEY);
                            this.addString(1, 'Timestamp');
                            this.addString(2, exports.PVALUE_KEY);
                            this.withPath(exports.PVALUE_KEY, () => this.addData(value.toISOString()));
                        }));
                        break;
                    case RegExp:
                        this.process(value, () => this.addHash(2, () => {
                            this.addString(2, exports.PTYPE_KEY);
                            this.addString(1, 'Regexp');
                            this.addString(2, exports.PVALUE_KEY);
                            this.withPath(exports.PVALUE_KEY, () => this.addData(value.source));
                        }));
                        break;
                    case String:
                        this.addString(level, value.valueOf());
                        break;
                    case Number:
                    case Boolean:
                        this.addData(value.valueOf());
                        break;
                    case Sensitive_1.Sensitive:
                        if (this.config.richData) {
                            this.process(value, () => this.addHash(2, () => {
                                this.addString(2, exports.PTYPE_KEY);
                                this.addString(1, 'Sensitive');
                                this.addString(2, exports.PVALUE_KEY);
                                this.withPath(exports.PVALUE_KEY, () => this.toData(1, value.unwrap()));
                            }));
                        }
                        else {
                            this.unknownToStringWithWarning(level, value);
                        }
                        break;
                    case undefined:
                        this.addData(null);
                        break;
                    default:
                        if (this.config.richData) {
                            this.valueToDataHash(value);
                        }
                        else {
                            this.unknownToStringWithWarning(1, value);
                        }
                }
        }
    }
    nonStringKeyedHashToData(hash) {
        if (this.config.richData) {
            this.toKeyExtendedHash(hash);
            return;
        }
        this.process(hash, () => this.addHash(hash.size, () => hash.forEach((v, k) => {
            const s = Util_1.strictString(k);
            if (s !== undefined) {
                this.addString(2, s);
                this.withPath(s, () => this.toData(1, v));
            }
            else {
                this.unknownToStringWithWarning(2, k);
                this.withPath(k, () => this.toData(1, v));
            }
        })));
    }
    toKeyExtendedHash(hash) {
        this.process(hash, () => this.addHash(2, () => {
            this.addString(2, exports.PTYPE_KEY);
            this.addString(1, 'Hash');
            this.addString(2, exports.PVALUE_KEY);
            this.addArray(hash.size * 2, () => hash.forEach((v, k) => {
                this.toData(1, k);
                this.withPath(k, () => this.toData(1, v));
            }));
        }));
    }
    valueToDataHash(value) {
        const pt = isPcoreObject(value) ? value.__ptype() : this.config.context.typeNames.nameForType(value.constructor);
        if (pt === undefined) {
            this.unknownToStringWithWarning(1, value);
            return;
        }
        this.process(value, () => {
            const pv = isPcoreValue(value) ? value.__pvalue() : SerializerContext.initializerFor(value);
            if (Util_1.isHash(pv)) {
                const es = Object.entries(pv);
                this.addHash(es.length + 1, () => {
                    this.addString(2, exports.PTYPE_KEY);
                    this.addString(1, pt);
                    for (const [k, v] of es) {
                        this.addString(2, k);
                        this.toData(1, v);
                    }
                });
            }
            else {
                this.addHash(2, () => {
                    this.addString(2, exports.PTYPE_KEY);
                    this.addString(1, pt);
                    this.addString(2, exports.PVALUE_KEY);
                    this.withPath(exports.PVALUE_KEY, () => this.toData(1, pv));
                });
            }
        });
    }
    addArray(len, doer) {
        this.refIndex++;
        this.consumer.addArray(len, doer);
    }
    addHash(len, doer) {
        this.refIndex++;
        this.consumer.addHash(len, doer);
    }
    addString(level, value) {
        if (this.dedupLevel >= level && value.length > this.consumer.stringDedupThreshold()) {
            const ref = this.strings[value];
            if (ref !== undefined) {
                this.consumer.addRef(ref);
                return;
            }
            else {
                this.strings[value] = this.refIndex;
            }
        }
        this.addData(value);
    }
    addData(value) {
        this.refIndex++;
        this.consumer.add(value);
    }
    pathToString() {
        return this.path.join('/');
    }
    process(value, doer) {
        if (this.dedupLevel === 0 /* NoDedup */) {
            doer();
            return;
        }
        const ref = this.values.get(value);
        if (ref !== undefined) {
            this.consumer.addRef(ref);
        }
        else {
            this.values.set(value, this.refIndex);
            doer();
        }
    }
    unknownToStringWithWarning(level, value) {
        const s = value.toString();
        let ts = typeof value;
        if (ts === 'object') {
            ts = value.constructor.name;
        }
        this.config.context.logger.warning('%s contains a value of type %s. It will be converted to the string \'%s\'', this.pathToString(), ts, s);
        this.addString(level, s);
    }
    withPath(value, doer) {
        this.path.push(value);
        doer();
        this.path.pop();
    }
    static initializerFor(value) {
        const init = {};
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                const prop = value[key];
                if (typeof prop !== 'function') {
                    init[key] = prop;
                }
            }
        }
        return init;
    }
}
//# sourceMappingURL=Serializer.js.map