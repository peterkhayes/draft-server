//      
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router');
const logger = require('koa-logger')

const app = new Koa();
const port = 8002;

app
  .use(logger())
  .use(bodyParser())
  .use((ctx, next) => {
    ctx.state.player = ctx.request.headers['player'];
    return next();
  })
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port);
console.log("Server started on port", port); // eslint-disable-line no-console