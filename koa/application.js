const Emitter = require('events')
const http = require('http')
class Application extends Emitter {
  constructor(options){
    super()
    this.middlewares = []
  }

  use(fn){
    if(typeof fn !== 'function'){
      throw new TypeError('middleware must be a function')
    }
    this.middlewares.push(fn)
    return this
  }
  // 合并middleware
  compose(){
    return async (ctx)=>{
      function createNext(middleware,oldNext){
        return async()=>{
          await middleware(ctx, oldNext)
        }
      }
      let next = async()=>{
        return Promise.resolve()
      }
      let len = this.middlewares.length
      for(let i=len-1;i>=0;i--){
        const middleware = this.middlewares[i]
        next = createNext(middleware, next)
      }
      await next()
    }
  }
  callback(){
    console.log(1)
    let fn = this.compose()
    return (req,res)=>{
      const ctx = this.createContext(req,res)
      return fn(ctx).then(() => this.respond(ctx))
    }
  }
  createContext(req,res){
    const context = Object.create({})
    context.app = this;
    context.req = req;
    context.res = res;
    context.originalUrl = req.url;
    context.state = {};
    return context
  }
  respond (ctx) { 
    const {res, body} = ctx
    if (body) {
      return res.end(String(ctx.body))
    }
      return res.end()
  }
  listen(...args){
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

module.exports = Application