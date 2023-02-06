import Ball from './ball';
import Player from './player';
import Rectangle from './rectangle';

export default class Pong {
  private ball: Ball;
  private callback: (ms: number) => void;
  private CHAR_PIXEL: number;
  private CHARS: HTMLCanvasElement[];

  public _canvas: HTMLCanvasElement;
  public _context: CanvasRenderingContext2D;
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

    let lastTime: number | null = null;
    this.callback = (ms: number) => {
      if (lastTime !== null) {
        const diff = ms - lastTime;
        this.update(diff / 1000);
      }

      lastTime = ms;
      requestAnimationFrame(this.callback);
    };

    this.CHAR_PIXEL = 10;
    this.CHARS = [
      '111101101101111',
      '010010010010010',
      '111001111100111',
      '111001111001111',
      '101101111001001',
      '111100111001111',
      '111100111101111',
      '111001001001001',
      '111101111101111',
      '111101111001111',
    ].map((string) => {
      const canvas = document.createElement('canvas');
      const size = this.CHAR_PIXEL;
      canvas.height = size * 5;
      canvas.width = size * 3;
      const context = canvas.getContext('2d');

      context!.fillStyle = '#fff';
      string.split('').forEach((fill, index) => {
        if (fill === '1') {
          context!.fillRect(
            (index % 3) * size,
            ((index / 3) | 0) * size,
            size,
            size
          );
        }
      });

      return canvas;
    });

    this.callback(0);

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

    this.drawScore();
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

  drawScore() {
    const align = this._canvas.width / 3;
    const charWidth = this.CHAR_PIXEL * 3;
    this.players.forEach((player, index) => {
      const chars = player.score.toString().split('');
      const offset =
        align * (index + 1) -
        ((charWidth * chars.length) / 2 + this.CHAR_PIXEL) / 2;
      chars.forEach((char, position) => {
        if (this.CHARS !== undefined) {
          this._context.drawImage(
            this.CHARS[+char],
            offset + position * charWidth,
            20
          );
        }
      });
    });
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
      ball.velocity.y = 300 * (Math.random() - 0.5);

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

    this.ball.velocity.x = Math.random() < 0.5 ? 300 : -300;
    this.ball.velocity.y = Math.random() * 300;

    this.ball.velocity.length = 300;
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
