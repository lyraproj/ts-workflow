"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const TypeTransformer_1 = require("./TypeTransformer");
class Type {
    constructor(typeString) {
        this.typeString = TypeTransformer_1.toPcoreType(typeString);
    }
    [util.inspect.custom](depth, options) {
        return this.typeString;
    }
    __ptype() {
        return 'Type';
    }
    __pvalue() {
        return this.typeString;
    }
}
exports.Type = Type;
exports.anyType = new Type('Any');
//# sourceMappingURL=Type.js.map