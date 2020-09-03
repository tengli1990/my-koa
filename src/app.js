import Koa from 'koa';

const app = new Koa()

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(4)
})


app.use(async (ctx, next) => {
  console.log(2)
  await next()
  console.log(3)
})

app.listen(3008, () => {
  console.log(`server is stared , http://localhost:3008`)
})