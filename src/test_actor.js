"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const genesis_1 = require("./genesis");
try {
    const ctx = new genesis_1.Actor();
    ctx.Action('a', (genesis, input) => __awaiter(this, void 0, void 0, function* () {
        let result = yield genesis.apply({ a: 'hello', b: 4 });
        return result;
    }), {}, { a: 'String', b: 'Integer' });
    ctx.Action('b1', (genesis, input) => __awaiter(this, void 0, void 0, function* () {
        return yield genesis.apply({ c: input.a + ' world', d: input.b + 4 });
    }), { a: 'String', b: 'Integer' }, { c: 'String', d: 'Integer' });
    ctx.Action('b2', (genesis, input) => __awaiter(this, void 0, void 0, function* () {
        return { e: input.a + ' earth', f: input.b + 8 };
    }), { a: 'String', b: 'Integer' }, { e: 'String', f: 'Integer' });
    ctx.Action('c', (genesis, input) => __awaiter(this, void 0, void 0, function* () {
        return {};
    }), { c: 'String', d: 'Integer', e: 'String', f: 'Integer' }, {});
    ctx.start();
}
catch (err) {
}
