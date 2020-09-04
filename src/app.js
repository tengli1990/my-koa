const  Koa = require('../koa/application.js') 

const app = new Koa()

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(4)
})


app.use(async (ctx, next) => {
  console.log(2)
  ctx.res.writeHead(200, { 'Content-Type': 'text/html' });
  ctx.body = '<html><head><meta charset="utf-8" /><title>实现简版koa</title></head><body>111</body></html>'
  await next()
  console.log(3)
})

app.listen(3008, () => {
  console.log(`server is stared: http://localhost:3008`)
})