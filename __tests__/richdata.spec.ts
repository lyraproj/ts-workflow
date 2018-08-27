/// <reference types="jest" />
import * as rich from "../src/richdata";

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

      _pname() : string {
        return 'My::Own::Item';
      }
    }
  }
}

describe('FromDataConverter', () => {
  it('should create object using positional constructor arguments', () => {
    let obj = new My.Own.Thing('Hello world');
    let createdObj = new rich.FromDataConverter(this,true).convert({
      __ptype: 'My::Own::Thing',
      message: 'Hello world'
    });
    expect(createdObj).toEqual(obj);
    expect(createdObj).toBeInstanceOf(My.Own.Thing)
  });

  it('should create object using named constructor arguments', () => {
    let obj = new My.Own.Item({ message: 'Hello world'});
    let createdObj = new rich.FromDataConverter(this,true).convert({
      __ptype: 'My::Own::Item',
      message: 'Hello world'
    });
    expect(createdObj).toEqual(obj);
    expect(createdObj).toBeInstanceOf(My.Own.Item)
  });

  it('object is not equal similar object in other namespace', () => {
    let createdObj = new rich.FromDataConverter(this,true).convert({
      __ptype: 'My::Own::Thing',
      message: 'Hello world'
    });
    expect(createdObj).not.toBeInstanceOf(My.Thing)
  });
});
