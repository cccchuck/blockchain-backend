const { koaBody } = require('koa-body')
const koaJwt = require('koa-jwt')

const app = require('./app')
const config = require('./app/config')
const usersRouter = require('./router/users.router')
const errorHandle = require('./app/errorHandle')

app.use(koaBody())
app.use(usersRouter.routes())
app.use(usersRouter.allowedMethods())

app.on('error', errorHandle)

app.listen(config.PORT, () => {
  console.log(`服务器在启动成功: http://localhost:${config.PORT}`)
})
