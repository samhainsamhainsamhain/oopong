class Pong {
  private canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  constructor(canvasName: string) {
    let canvas = document.getElementById(canvasName) as HTMLCanvasElement;
    let context = canvas.getContext('2d');
    if (!context || !(context instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2D context');
    }

    this.canvas = canvas;
    this.context = context;
    this.canvas.style.background = '#333bbb';
    this.fitToContainer();
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  fitToContainer() {
    // Make it visually fill the positioned parent
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    // ...then set the internal size to match
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }
}

const App = new Pong('canvas');
