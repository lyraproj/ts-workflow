import {Value} from "./Util";

export class Sensitive {
  private readonly value : Value;

  constructor(value : Value) {
    this.value = value;
  }

  toString() : string {
    return 'Sensitive [value redacted]';
  }

  unwrap() : Value {
    return this.value;
  }
}
