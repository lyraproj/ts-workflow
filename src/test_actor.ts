import {Actor, Genesis} from "./genesis";

try {
  const ctx = new Actor();
  ctx.Action('a', async (genesis: Genesis, input: {}) => {
    let result = await genesis.apply({a: 'hello', b: 4});
    return result;
  }, {}, {a: 'String', b: 'Integer'});

  ctx.Action('b1', async (genesis: Genesis, input: { a: string, b: number }) => {
    return await genesis.apply({c: input.a + ' world', d: input.b + 4});
  }, {a: 'String', b: 'Integer'}, {c: 'String', d: 'Integer'});

  ctx.Action('b2', async (genesis: Genesis, input: { a: string, b: number }) => {
    return {e: input.a + ' earth', f: input.b + 8};
  }, {a: 'String', b: 'Integer'}, {e: 'String', f: 'Integer'});

  ctx.Action('c', async (genesis: Genesis, input: object) => {
    return {};
  }, {c: 'String', d: 'Integer', e: 'String', f: 'Integer'}, {});
  ctx.start();
} catch (err) {
}
