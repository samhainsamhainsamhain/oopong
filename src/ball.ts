import Rectangle from './rectangle';
import Vector from './vector';

export default class Ball extends Rectangle {
  velocity: Vector;

  constructor(color: string) {
    super(10, 10, color);
    this.velocity = new Vector();
  }
}
