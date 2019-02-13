"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemCollector {
    constructor() {
        this.values = new Array();
        this.stack = new Array();
        this.stack.push(new Array());
    }
    add(value) {
        this.addAny(value);
    }
    addArray(len, doer) {
        const ar = new Array();
        this.addAny(ar);
        this.stack.push(ar);
        doer();
        this.stack.pop();
    }
    addHash(len, doer) {
        const h = new Map();
        this.addAny(h);
        this.stack.push(new Array());
        doer();
        const els = this.stack.pop();
        if (els === undefined || els.length % 2 !== 0) {
            throw new Error('Hash function produced uneven number of elements');
        }
        for (let i = 0; i < els.length; i += 2) {
            h.set(els[i], els[i + 1]);
        }
    }
    addRef(ref) {
        this.stack[this.stack.length - 1].push(this.values[ref]);
    }
    canDoComplexKeys() {
        return true;
    }
    canDoBinary() {
        return true;
    }
    stringDedupThreshold() {
        return 0;
    }
    value() {
        return this.stack[0][0];
    }
    addAny(value) {
        this.stack[this.stack.length - 1].push(value);
        this.values.push(value);
    }
}
exports.MemCollector = MemCollector;
//# sourceMappingURL=Collector.js.map