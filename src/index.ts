import Pong from './pong';

const App = new Pong('canvas');

App._canvas.addEventListener('mousemove', (event) => {
  App.players[0].position.y = event.offsetY;
});

App._canvas.addEventListener('click', () => {
  App.start();
});
