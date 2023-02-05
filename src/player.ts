import Rectangle from './rectangle';

export default class Player extends Rectangle {
  public score: number;
  constructor() {
    super(20, 100, 'white');
    this.score = 0;
  }
}
