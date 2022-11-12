const { koaBody } = require('koa-body')

const app = require('./app')
const config = require('./app/config')
const usersRouter = require('./router/users.router')

app.use(koaBody())
app.use(usersRouter.routes())
app.use(usersRouter.allowedMethods())

app.listen(config.PORT, () => {
  console.log(`服务器在 ${config.PORT} 端口上启动成功`)
})
