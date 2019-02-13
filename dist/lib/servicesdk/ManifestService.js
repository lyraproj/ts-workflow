"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ManifestService {
    constructor(sb) {
        const cbs = {};
        for (const [k, v] of Object.entries(sb.actionFunctions)) {
            cbs[k] = { do: v };
        }
        this.callables = cbs;
        this.definitions = sb.definitions;
        this.stateFunctions = sb.stateProducers;
    }
    invoke(identifier, name, args) {
        const c = this.callables[identifier];
        if (c === undefined) {
            throw new Error(`Unable to find implementation of ${identifier}`);
        }
        const m = c[name];
        if (m === undefined) {
            throw new Error(`Implementation of ${identifier} has no method named ${name}`);
        }
        return m(...args);
    }
    metadata() {
        return [null, this.definitions];
    }
    state(name, input) {
        const f = this.stateFunctions[name];
        if (f === undefined) {
            throw new Error(`unable to find state producer for ${name}`);
        }
        const pns = parameterNames(f);
        const args = new Array();
        for (let i = 0; i < pns.length; i++) {
            const pn = pns[i];
            const v = input[pn];
            if (v === undefined) {
                throw Error(`state ${name} cannot be produced. Missing input parameter ${pn}`);
            }
            args.push(v);
        }
        return f(...args);
    }
}
exports.ManifestService = ManifestService;
const paramNamePattern = new RegExp('^(?:function(?:\\s+\\w+)?\\s*)?\\(([^)]*)\\)', 'm');
function parameterNames(s) {
    // @ts-ignore
    return s.toString().match(paramNamePattern)[1].split(',').map(v => v.trim());
}
//# sourceMappingURL=ManifestService.js.map