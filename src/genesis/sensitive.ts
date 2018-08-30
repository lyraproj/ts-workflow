export class Sensitive {
  private readonly value : any;

  constructor(value : any) {
    this.value = value;
  }

  toString() : string {
    return 'Sensitive [value redacted]';
  }

  unwrap() : any {
    return this.value;
  }
}