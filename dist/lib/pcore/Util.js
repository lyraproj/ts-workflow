"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isHash(value) {
    return value !== null && typeof value === 'object' && value.constructor === Object;
}
exports.isHash = isHash;
function strictString(value) {
    if (value === null) {
        return undefined;
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'object' && value.constructor === String) {
        return value.valueOf();
    }
    return undefined;
}
exports.strictString = strictString;
function isStringMap(map) {
    if (map instanceof Map) {
        for (const key in map.keys()) {
            if (strictString(key) === undefined) {
                return false;
            }
        }
        return true;
    }
    return false;
}
exports.isStringMap = isStringMap;
function makeInt(arg) {
    let n = NaN;
    if (typeof arg === 'number') {
        n = arg;
    }
    else if (typeof arg === 'string') {
        n = Number(arg);
    }
    // TODO: Add hash constructor etc.
    if (isNaN(n) || (n % 1) !== 0) {
        throw new Error(`not an integer '${arg}'`);
    }
    return n;
}
exports.makeInt = makeInt;
function makeFloat(arg) {
    let n = NaN;
    if (typeof arg === 'number') {
        n = arg;
    }
    else if (typeof arg === 'string') {
        n = Number(arg);
    }
    // TODO: Add hash constructor etc.
    if (isNaN(n)) {
        throw new Error(`not a float '${arg}'`);
    }
    return n;
}
exports.makeFloat = makeFloat;
function makeBoolean(arg) {
    if (typeof arg === 'boolean') {
        return arg;
    }
    if (typeof arg === 'string') {
        switch (arg.toLowerCase()) {
            case 'true':
                return true;
            case 'false':
                return false;
        }
    }
    if (typeof arg === 'number') {
        return arg !== 0;
    }
    throw new Error(`not a boolean '${arg}'`);
}
exports.makeBoolean = makeBoolean;
function makeString(arg) {
    return arg === null ? undefined : arg.toString();
}
exports.makeString = makeString;
//# sourceMappingURL=Util.js.map