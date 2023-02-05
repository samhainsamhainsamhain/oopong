import Vector from './vector';

export default class Rectangle {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public color: string;
  public position: Vector;
  public size: Vector;

  constructor(
    width: number,
    height: number,
    color: string,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    this.color = color;
    this.position = new Vector();
    this.size = new Vector(width, height);
    this.context = context;
    this.canvas = canvas;
  }

  get left() {
    return this.position.x - this.size.x / 2;
  }

  get right() {
    return this.position.x + this.size.x / 2;
  }

  get top() {
    return this.position.y - this.size.y / 2;
  }

  get bottom() {
    return this.position.y + this.size.y / 2;
  }
}
