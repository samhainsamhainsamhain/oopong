export default class Vector {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set length(value) {
    const fact = value / this.length;
    this.x *= fact;
    this.y *= fact;
  }
}
