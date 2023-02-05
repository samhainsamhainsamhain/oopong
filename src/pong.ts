import Ball from './ball';
import Player from './player';
import Rectangle from './rectangle';

export default class Pong {
  public _canvas: HTMLCanvasElement;
  public _context: CanvasRenderingContext2D;
  private ball: Ball;
  public players: Player[];

  constructor(canvasName: string) {
    let canvas = document.getElementById(canvasName) as HTMLCanvasElement;
    let context = canvas.getContext('2d');
    if (!context || !(context instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2D context');
    }

    this._canvas = canvas;
    this._context = context;

    this.fitToContainer();

    this.ball = new Ball('red');

    this.players = [new Player(), new Player()];

    this.players[0].position.x = 40;
    this.players[1].position.x = this._canvas.width - 40;
    this.players.forEach(
      (player) => (player.position.y = this._canvas.height / 2)
    );

    let lastTime: number | undefined;
    const callback = (ms: number) => {
      if (lastTime) {
        this.update((ms - lastTime) / 1000);
      }

      lastTime = ms;
      requestAnimationFrame(callback.bind(this));
    };

    callback(0);

    this.reset();
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
    this.players.forEach((player) => this.drawRectangle(player));
  }

  drawRectangle(rectangle: Rectangle) {
    this._context.fillStyle = rectangle.color;
    this._context.fillRect(
      rectangle.left,
      rectangle.top,
      rectangle.size.x,
      rectangle.size.y
    );
  }

  collide(player: Player, ball: Ball) {
    if (
      player.left < ball.right &&
      player.right > ball.left &&
      player.top < ball.bottom &&
      player.bottom > ball.top
    ) {
      const length = ball.velocity.length;

      ball.velocity.x *= -1;
      ball.velocity.y = 200 * (Math.random() - 0.5);

      ball.velocity.length = length * 1.05;
    }
  }

  reset() {
    this.ball.position.x = this._canvas.width / 2;
    this.ball.position.y = this._canvas.height / 2;

    this.ball.velocity.x = 0;
    this.ball.velocity.y = 0;
  }

  start() {
    if (this.ball.velocity.x !== 0 || this.ball.velocity.y !== 0) return;

    this.ball.velocity.x = Math.random() < 0.5 ? 200 : -200;
    this.ball.velocity.y = Math.random() * 200;

    this.ball.velocity.length = 200;
  }

  update(dt: number = 0) {
    this.ball.position.x += this.ball.velocity.x * dt;
    this.ball.position.y += this.ball.velocity.y * dt;

    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      let playerId = this.ball.velocity.x < 0 ? 1 : 0;

      this.players[playerId].score++;
      this.reset();
    }

    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.velocity.y *= -1;
    }

    this.players[1].position.y = this.ball.position.y;

    this.players.forEach((player) => this.collide(player, this.ball));

    this.draw();
  }
}
