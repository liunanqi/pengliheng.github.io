// package
const http = require('http');
const path = require('path');
const Koa = require('koa');
const json = require('koa-json');
const koaSend = require('koa-send');
const logger = require('koa-logger');
const koaStatic = require('koa-static');

// local
const config = require('../../config/server');
const allRouter = require('./routes/index.js');

// application
const app = new Koa();
const server = http.createServer(app.callback());
const port = process.env.PORT || config.port
app
  .use(json())
  .use(logger())
  .use(koaStatic(path.resolve('./dist')))
  .use(allRouter.routes())
  .use(allRouter.allowedMethods())
// 将前端路由指向 index.html
  .use(async (ctx, next) => {
    if (!/\./.test(ctx.request.url)) {
      await koaSend(
        ctx,
        'index.html',
        {
          root: path.resolve('./dist'),
          gzip: true,
        },
      );
    } else {
      await next();
    }
  });

server.listen(port, () => {
  console.log(` >>> port: ${port}`);
  console.log(` >>> ENV: ${process.env.NODE_ENV}`);
  console.log(` >>> access_token: ${process.env.access_token}`);
});
