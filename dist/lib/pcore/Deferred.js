"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Deferred {
    constructor(name, ...args) {
        this.name = name;
        this.args = args;
    }
    __ptype() {
        return 'Deferred';
    }
    __pvalue() {
        return { name: this.name, arguments: this.args };
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=Deferred.js.map