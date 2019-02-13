"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const Type_1 = require("./Type");
class Parameter {
    constructor(name, type, value, captures) {
        this.name = name;
        if (type === undefined) {
            type = Type_1.anyType;
        }
        else if (typeof type === 'string') {
            type = new Type_1.Type(type);
        }
        this.type = type;
        this.value = value;
        this.captures = captures;
    }
    [util.inspect.custom](depth, options) {
        return `Parameter ${util.inspect(this.__pvalue(), depth, options)}`;
    }
    __ptype() {
        return 'Parameter';
    }
    __pvalue() {
        const m = { name: this.name, type: this.type };
        if (this.value !== undefined) {
            m['value'] = this.value;
        }
        if (this.value === null) {
            m['has_value'] = true;
        }
        if (this.captures === true) {
            m['captures_rest'] = true;
        }
        return m;
    }
}
exports.Parameter = Parameter;
//# sourceMappingURL=Parameter.js.map