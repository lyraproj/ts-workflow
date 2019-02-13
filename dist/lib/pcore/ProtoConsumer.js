"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const data_pb_1 = require("../../generated/datapb/data_pb");
class ProtoConsumer {
    constructor() {
        this.stack = new Array();
        this.stack.push(new Array());
    }
    add(value) {
        const d = new data_pb_1.Data();
        switch (typeof value) {
            case 'number':
                value % 1 === 0 ? d.setIntegerValue(value) : d.setFloatValue(value);
                break;
            case 'boolean':
                d.setBooleanValue(value);
                break;
            case 'string':
                d.setStringValue(value);
                break;
            default:
                if (util_1.types.isUint8Array(value)) {
                    d.setBinaryValue(value);
                }
                else {
                    d.setUndefValue(data_pb_1.NullValue.NULL_VALUE);
                }
        }
        this.addData(d);
    }
    addArray(len, doer) {
        this.stack.push(new Array());
        doer();
        const els = this.stack.pop();
        if (els === undefined) {
            throw new Error('Array function caused data consumer unbalance');
        }
        const a = new data_pb_1.DataArray();
        a.setValuesList(els);
        const d = new data_pb_1.Data();
        d.setArrayValue(a);
        this.addData(d);
    }
    addHash(len, doer) {
        this.stack.push(new Array());
        doer();
        const els = this.stack.pop();
        if (els === undefined) {
            throw new Error('Hash function caused data consumer unbalance');
        }
        if (els.length % 2 !== 0) {
            throw new Error('Hash function produced uneven number of elements');
        }
        const entries = new Array();
        for (let i = 0; i < els.length; i += 2) {
            const de = new data_pb_1.DataEntry();
            de.setKey(els[i]);
            de.setValue(els[i + 1]);
            entries.push(de);
        }
        const h = new data_pb_1.DataHash();
        h.setEntriesList(entries);
        const d = new data_pb_1.Data();
        d.setHashValue(h);
        this.addData(d);
    }
    addRef(ref) {
        const d = new data_pb_1.Data();
        d.setReference(ref);
        this.addData(d);
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
    addData(value) {
        this.stack[this.stack.length - 1].push(value);
    }
}
exports.ProtoConsumer = ProtoConsumer;
function consumePBData(data, consumer) {
    switch (data.getKindCase().valueOf()) {
        case data_pb_1.Data.KindCase.BOOLEAN_VALUE:
            consumer.add(data.getBooleanValue());
            break;
        case data_pb_1.Data.KindCase.INTEGER_VALUE:
            consumer.add(data.getIntegerValue());
            break;
        case data_pb_1.Data.KindCase.FLOAT_VALUE:
            consumer.add(data.getFloatValue());
            break;
        case data_pb_1.Data.KindCase.STRING_VALUE:
            consumer.add(data.getStringValue());
            break;
        case data_pb_1.Data.KindCase.ARRAY_VALUE:
            // @ts-ignore
            const av = data.getArrayValue().getValuesList();
            consumer.addArray(av.length, () => av.forEach((e) => consumePBData(e, consumer)));
            break;
        case data_pb_1.Data.KindCase.HASH_VALUE:
            // @ts-ignore
            const hv = data.getHashValue().getEntriesList();
            consumer.addHash(hv.length, () => hv.forEach((entry) => {
                // @ts-ignore
                consumePBData(entry.getKey(), consumer);
                // @ts-ignore
                consumePBData(entry.getValue(), consumer);
            }));
            break;
        case data_pb_1.Data.KindCase.BINARY_VALUE:
            consumer.add(data.getBinaryValue());
            break;
        case data_pb_1.Data.KindCase.REFERENCE:
            consumer.addRef(data.getReference());
            break;
        default:
            consumer.add(null);
    }
}
exports.consumePBData = consumePBData;
//# sourceMappingURL=ProtoConsumer.js.map