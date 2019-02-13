import {ValueConsumer} from "./Serializer";
import {Value} from "./Util";

export interface Collector extends ValueConsumer {
  value() : Value;
}

export class MemCollector implements Collector {
  private readonly values : Value[];
  private readonly stack : Value[][];

  constructor() {
    this.values = new Array<Value>();
    this.stack = new Array<Value[]>();
    this.stack.push(new Array<Value>());
  }

  add(value: boolean | number | string | Uint8Array | null) {
    this.addAny(value);
  }

  addArray(len: number, doer: () => void) {
    const ar = new Array<Value>();
    this.addAny(ar);
    this.stack.push(ar);
    doer();
    this.stack.pop();
  }

  addHash(len: number, doer: () => void) {
    const h = new Map<Value,Value>();
    this.addAny(h);
    this.stack.push(new Array<Value>());
    doer();
    const els = this.stack.pop();
    if(els === undefined || els.length % 2 !== 0) {
      throw new Error('Hash function produced uneven number of elements');
    }
    for(let i = 0; i < els.length; i += 2) {
      h.set(els[i], els[i+1]);
    }
  }

  addRef(ref: number) {
    this.stack[this.stack.length - 1].push(this.values[ref]);
  }

  canDoComplexKeys(): boolean {
    return true;
  }

  canDoBinary(): boolean {
    return true;
  }

  stringDedupThreshold(): number {
    return 0;
  }

  value(): Value {
    return this.stack[0][0];
  }

  private addAny(value: Value) {
    this.stack[this.stack.length - 1].push(value);
    this.values.push(value);
  }
}
