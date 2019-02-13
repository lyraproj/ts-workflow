"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sensitive {
    constructor(value) {
        this.value = value;
    }
    toString() {
        return 'Sensitive [value redacted]';
    }
    unwrap() {
        return this.value;
    }
}
exports.Sensitive = Sensitive;
//# sourceMappingURL=Sensitive.js.map