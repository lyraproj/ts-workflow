class Point {
  readonly x : number;
  readonly y : number;

  constructor({x = 3, y} : {x? : number, y :number})
  {
    this.x = x;
    this.y = y;
  }

  typeName() {

  }
};

const origin: Point = new Point({ x: 0, y: 1 });

console.log(origin.constructor.name);
console.log(origin.x, origin.y);
