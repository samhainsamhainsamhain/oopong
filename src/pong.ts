import Ball from './ball';
import Rectangle from './rectangle';

export default class Pong {
  public _canvas: HTMLCanvasElement;
  public _context: CanvasRenderingContext2D;
  private ball: Ball;

  constructor(canvasName: string) {
    let canvas = document.getElementById(canvasName) as HTMLCanvasElement;
    let context = canvas.getContext('2d');
    if (!context || !(context instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2D context');
    }

    this._canvas = canvas;
    this._context = context;

    this.ball = new Ball('red', this._context, this._canvas);

    this.ball.position.x = 400;
    this.ball.position.y = 100;

    this.ball.velocity.x = 100;
    this.ball.velocity.y = 100;

    let lastTime: number | undefined;
    const callback = (ms: number) => {
      if (lastTime) {
        this.update((ms - lastTime) / 1000);
      }

      lastTime = ms;
      requestAnimationFrame(callback.bind(this));
    };

    callback(0);
  }

  clear(): void {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  fitToContainer() {
    // Make it visually fill the positioned parent
    this._canvas.style.width = '100%';
    this._canvas.style.height = '100%';
    // ...then set the internal size to match
    this._canvas.width = this._canvas.offsetWidth;
    this._canvas.height = this._canvas.offsetHeight;
  }

  draw() {
    this._canvas.style.background = '#000000';
    this.clear();
    this.drawRectangle(this.ball);
  }

  drawRectangle(rectangle: Rectangle) {
    this._context.fillStyle = rectangle.color;
    this._context.fillRect(
      rectangle.position.x,
      rectangle.position.y,
      rectangle.size.x,
      rectangle.size.y
    );
  }

  update(dt: number = 0) {
    this.ball.position.x += this.ball.velocity.x * dt;
    this.ball.position.y += this.ball.velocity.y * dt;

    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      this.ball.velocity.x *= -1;
    }
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.velocity.y *= -1;
    }

    this.draw();
  }
}
