import Rectangle from './rectangle';
import Vector from './vector';

export default class Ball extends Rectangle {
  velocity: Vector;

  constructor(
    color: string,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    super(10, 10, color, context, canvas);
    this.velocity = new Vector();
  }

  update(dt: number = 0) {
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    if (this.left < 0 || this.right > this.canvas.width) {
      this.velocity.x *= -1;
    }
    if (this.top < 0 || this.bottom > this.canvas.height) {
      this.velocity.y *= -1;
    }

    this.context.fillStyle = this.color;
    this.context.fillRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  }
}
