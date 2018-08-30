/// <reference types="jest" />
import {FromDataConverter, ToDataConverter} from "../src/genesis/richdata";

export namespace My {
  export class Thing {
    constructor(public message: string) {};

    what() {
      return this.message;
    }
  }

  export namespace Own {
    export class Thing {
      constructor(public message: string) {};

      what() {
        return this.message;
      }
    }

    export class Item {
      private message : string;

      constructor({message} : {message: string}) {
        this.message = message;
      }

      what() {
        return this.message;
      }

      __ptype() : string {
        return 'My::Own::Item';
      }
    }
  }
}

describe('FromDataConverter', () => {
  it('should create object using positional constructor arguments', () => {
    let obj = new My.Own.Thing('Hello world');
    let createdObj = new FromDataConverter(this).convert({
      __ptype: 'My::Own::Thing',
      message: 'Hello world'
    });
    expect(createdObj).toEqual(obj);
    expect(createdObj).toBeInstanceOf(My.Own.Thing)
  });

  it('should create object using named constructor arguments', () => {
    let obj = new My.Own.Item({ message: 'Hello world'});
    let createdObj = new FromDataConverter(this).convert({
      __ptype: 'My::Own::Item',
      message: 'Hello world'
    });
    expect(createdObj).toEqual(obj);
    expect(createdObj).toBeInstanceOf(My.Own.Item)
  });

  it('object is not equal similar object in other namespace', () => {
    let createdObj = new FromDataConverter(this).convert({
      __ptype: 'My::Own::Thing',
      message: 'Hello world'
    });
    expect(createdObj).not.toBeInstanceOf(My.Thing)
  });
});

describe('ToDataConverter', () => {
  it('should create Data from object using positional constructor arguments', () => {
    let obj = new My.Own.Thing('Hello world');
    let data = new ToDataConverter(this).convert(obj);
    expect(data).toEqual({
      __ptype: 'My::Own::Thing',
      message: 'Hello world'
    });
  });

  it('should create Data from object using named constructor arguments', () => {
    let obj = new My.Own.Item({ message: 'Hello world'});
    let data = new ToDataConverter(this).convert(obj);
    expect(data).toEqual({
      __ptype: 'My::Own::Item',
      message: 'Hello world'
    });
  });
});
