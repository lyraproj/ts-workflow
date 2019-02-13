"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const Deferred_1 = require("../pcore/Deferred");
const Parameter_1 = require("../pcore/Parameter");
const Type_1 = require("../pcore/Type");
const TypedName_1 = require("../pcore/TypedName");
const Util_1 = require("../pcore/Util");
function isActivityMap(m) {
    const s = m.style;
    return s === 'action' || s === 'resource' || s === 'workflow';
}
exports.isActivityMap = isActivityMap;
function action(a) {
    a.style = 'action';
    return a;
}
exports.action = action;
function resource(a) {
    a.style = 'resource';
    return a;
}
exports.resource = resource;
function workflow(a) {
    a.style = 'workflow';
    return a;
}
exports.workflow = workflow;
class ServiceBuilder {
    constructor(serviceName) {
        this.definitions = [];
        this.stateProducers = {};
        this.actionFunctions = {};
        this.serviceId = new TypedName_1.TypedName(TypedName_1.Namespace.NsService, serviceName);
    }
    fromMap(n, a, inferred) {
        switch (a.style) {
            case 'action':
                const ab = new ActionBuilder(n, null);
                ab.fromMap(a);
                this.definitions.push(ab.build(this, inferred));
                break;
            case 'resource':
                const rb = new ResourceBuilder(n, null);
                rb.fromMap(a);
                this.definitions.push(rb.build(this, inferred));
                break;
            case 'workflow':
                const wb = new WorkflowBuilder(n, null);
                wb.fromMap(a);
                this.definitions.push(wb.build(this, inferred));
                break;
            default:
                throw new Error(`activity hash for ${n} has no valid style`);
        }
    }
}
exports.ServiceBuilder = ServiceBuilder;
class Definition {
    constructor(serviceId, identifier, properties) {
        this.serviceId = serviceId;
        this.identifier = identifier;
        this.properties = properties;
    }
    toString() {
        return util.formatWithOptions({ depth: 10 }, '%O', this);
    }
    __ptype() {
        return 'Service::Definition';
    }
}
exports.Definition = Definition;
class ActivityBuilder {
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
    }
    amendWithInferredTypes(inferred) {
        if (this.in === undefined) {
            const ii = inferred['input'];
            if (ii !== undefined) {
                this.input(ii);
            }
        }
        if (this.out === undefined) {
            const io = inferred['output'];
            if (io !== undefined) {
                this.output(io);
            }
        }
    }
    getLeafName() {
        return this.name;
    }
    getName() {
        return this.parent !== null ? this.parent.qualifyName(this.name) : this.name;
    }
    fromMap(m) {
        if (m.when !== undefined) {
            this.when(m.when);
        }
        if (m.input !== undefined) {
            this.input(m.input);
        }
        if (m.output !== undefined) {
            this.output(m.output);
        }
    }
    when(guard) {
        this.guard = guard;
    }
    input(params) {
        const ps = this.convertParams(true, params);
        if (this.in === undefined) {
            this.in = ps;
        }
        else {
            Object.assign(this.in, ps);
        }
    }
    output(params) {
        const ps = this.convertParams(false, params);
        if (this.out === undefined) {
            this.out = ps;
        }
        else {
            Object.assign(this.out, ps);
        }
    }
    build(sb, inferred) {
        if (inferred !== null) {
            this.amendWithInferredTypes(inferred);
        }
        return new Definition(sb.serviceId, new TypedName_1.TypedName(TypedName_1.Namespace.NsDefinition, this.getName()), this.definitionProperties(sb, inferred));
    }
    qualifyName(n) {
        return this.getName() + '::' + n;
    }
    convertParams(isIn, params) {
        const result = {};
        if (typeof params === 'string') {
            // A single untyped parameter name
            result[params] = new Parameter_1.Parameter(params, Type_1.anyType);
        }
        else if (Array.isArray(params)) {
            // Array of untyped parameter names
            params.forEach((p) => {
                result[p] = new Parameter_1.Parameter(p, Type_1.anyType);
            });
        }
        else {
            // Map of typed parameters
            for (const [key, value] of Object.entries(params)) {
                let type = Type_1.anyType;
                if (typeof value === 'string') {
                    type = new Type_1.Type(value);
                    result[key] = new Parameter_1.Parameter(key, type);
                }
                else {
                    if (value.hasOwnProperty('type')) {
                        type = new Type_1.Type(value['type']);
                    }
                    // Input parameters can have lookup, output parameters can have alias.
                    let alu;
                    if (isIn) {
                        if (value.hasOwnProperty('lookup')) {
                            alu = new Deferred_1.Deferred('lookup', value['lookup']);
                        }
                        else {
                            throw new Error(`illegal input parameter assignment for parameter ${key}: ${value.toString()}`);
                        }
                    }
                    else {
                        if (value.hasOwnProperty('alias')) {
                            alu = value['alias'];
                        }
                        else {
                            throw new Error(`illegal input parameter assignment for parameter ${key}: ${value.toString()}`);
                        }
                    }
                    result[key] = new Parameter_1.Parameter(key, type, alu);
                }
            }
        }
        return result;
    }
    definitionProperties(sb, inferred) {
        const props = {};
        if (this.in !== undefined) {
            props['input'] = this.in;
        }
        if (this.out !== undefined) {
            props['output'] = this.out;
        }
        if (this.guard !== undefined) {
            props['when'] = this.guard;
        }
        return props;
    }
}
exports.ActivityBuilder = ActivityBuilder;
class ResourceBuilder extends ActivityBuilder {
    amendWithInferredTypes(inferred) {
        super.amendWithInferredTypes(inferred);
        if (this.typ === undefined) {
            const it = inferred['type'];
            if (typeof it === 'string') {
                this.type(it);
            }
        }
    }
    externalId(extId) {
        this.extId = extId;
    }
    state(stateProducer) {
        this.stateProducer = stateProducer;
    }
    type(t) {
        this.typ = t;
    }
    build(sb, inferred) {
        if (this.stateProducer !== undefined) {
            sb.stateProducers[this.getName()] = this.stateProducer;
        }
        return super.build(sb, inferred);
    }
    fromMap(m) {
        super.fromMap(m);
        this.state(m.state);
        if (m.type !== undefined) {
            this.type(m.type);
        }
        if (m.externalId !== undefined) {
            this.externalId(m.externalId);
        }
    }
    definitionProperties(sb, inferred) {
        const props = super.definitionProperties(sb, inferred);
        if (this.extId !== undefined) {
            props['external_id'] = this.extId;
        }
        if (this.typ !== undefined) {
            props['type'] = this.typ;
        }
        return props;
    }
}
exports.ResourceBuilder = ResourceBuilder;
class ActionBuilder extends ActivityBuilder {
    do(actionFunction) {
        this.actionFunction = actionFunction;
    }
    build(sb, inferred) {
        if (this.actionFunction !== undefined) {
            sb.actionFunctions[this.getName()] = this.actionFunction;
        }
        return super.build(sb, inferred);
    }
    fromMap(m) {
        super.fromMap(m);
        this.do(m.do);
    }
}
exports.ActionBuilder = ActionBuilder;
class WorkflowBuilder extends ActivityBuilder {
    constructor() {
        super(...arguments);
        this.activities = [];
    }
    amendWithInferredTypes(inferred) {
        super.amendWithInferredTypes(inferred);
        this.activities.forEach(a => {
            const sub = inferred[a.getLeafName()];
            if (Util_1.isHash(sub)) {
                a.amendWithInferredTypes(sub);
            }
        });
    }
    fromMap(m) {
        super.fromMap(m);
        for (const [n, a] of Object.entries(m.activities)) {
            switch (a.style) {
                case 'action':
                    const ab = new ActionBuilder(n, this);
                    ab.fromMap(a);
                    this.activities.push(ab);
                    break;
                case 'resource':
                    const rb = new ResourceBuilder(n, this);
                    rb.fromMap(a);
                    this.activities.push(rb);
                    break;
                case 'workflow':
                    const wb = new WorkflowBuilder(n, this);
                    wb.fromMap(a);
                    this.activities.push(wb);
                    break;
                default:
                    throw new Error(`activity hash for ${this.qualifyName(n)} has no valid style`);
            }
        }
    }
    action(name, bf) {
        const rb = new ActionBuilder(name, this);
        bf(rb);
        this.activities.push(rb);
    }
    resource(name, bf) {
        const rb = new ResourceBuilder(name, this);
        bf(rb);
        this.activities.push(rb);
    }
    workflow(name, bf) {
        const rb = new WorkflowBuilder(name, this);
        bf(rb);
        this.activities.push(rb);
    }
    definitionProperties(sb, inferred) {
        const props = super.definitionProperties(sb, inferred);
        props['activities'] = this.activities.map(ab => ab.build(sb, inferred));
        return props;
    }
}
exports.WorkflowBuilder = WorkflowBuilder;
//# sourceMappingURL=ServiceBuilder.js.map