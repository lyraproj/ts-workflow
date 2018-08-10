"use strict";
class Point {
    constructor({ x = 3, y }) {
        this.x = x;
        this.y = y;
    }
    typeName() {
    }
}
;
const origin = new Point({ x: 0, y: 1 });
console.log(origin.constructor.name);
console.log(origin.x, origin.y);
