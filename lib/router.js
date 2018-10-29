//      
const Router = require('koa-router');
const data = require('./data');

const router = new Router();

router.post('/player', (ctx) => {
  const { player } = ctx.request.body
  data.addPlayer(player);
  ctx.body = data.playerGetState(player);
});

router.get('/state', (ctx) => {
  const { player } = ctx.state;
  ctx.body = data.playerGetState(player);
});

router.post('/start', (ctx) => {
  const { player } = ctx.state;
  data.startGame();
  ctx.body = data.playerGetState(player);
});

router.post('/choose', (ctx) => {
  const { player } = ctx.state;
  const { choices } = ctx.request.body
  data.playerSetChoices(player, choices);
  ctx.body = data.playerGetState(player);
});

module.exports = router;