"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
var Namespace;
(function (Namespace) {
    Namespace["NsType"] = "type";
    Namespace["NsFunction"] = "function";
    Namespace["NsInterface"] = "interface";
    Namespace["NsDefinition"] = "definition";
    Namespace["NsHandler"] = "handler";
    Namespace["NsService"] = "service";
    Namespace["NsActivity"] = "activity";
    Namespace["NsAllocator"] = "allocator";
    Namespace["NsConstructor"] = "constructor";
})(Namespace = exports.Namespace || (exports.Namespace = {}));
exports.runtimeAuthority = new URL('http://puppet.com/2016.1/runtime');
class TypedName {
    constructor(namespace, name, authority = exports.runtimeAuthority) {
        let parts = name.toLowerCase().split('::');
        if (parts.length > 0 && parts[0] === '' && name.length > 2) {
            // Name starts with '::'. Get rid of it.
            parts = parts.slice(1);
            name = name.substring(2);
        }
        parts.forEach((v) => {
            if (!TypedName.allowedCharacters.test(v)) {
                throw new Error(`Invalid characters in part '${v}' of name '${name}'`);
            }
        });
        this.namespace = namespace;
        this.name = name;
        this.authority = authority;
        this.parts = parts;
        this.canonical = `${this.authority}/${namespace}/${name}`.toLowerCase();
    }
    toString() {
        return `${this.authority}/${this.namespace}/${this.name}`;
    }
    [util.inspect.custom](depth, options) {
        return `TypedName ${util.inspect(this.__pvalue(), depth, options)}`;
    }
    __ptype() {
        return 'TypedName';
    }
    __pvalue() {
        const mv = { namespace: this.namespace.toString(), name: this.name };
        if (this.authority !== exports.runtimeAuthority) {
            mv['authority'] = this.authority.toString();
        }
        return mv;
    }
}
TypedName.allowedCharacters = new RegExp('^[a-z][0-9_a-z]*$');
exports.TypedName = TypedName;
//# sourceMappingURL=TypedName.js.map