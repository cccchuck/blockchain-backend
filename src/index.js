const { koaBody } = require('koa-body')
const koaJwt = require('koa-jwt')

const app = require('./app')
const { PORT, SECRET } = require('./app/config')
const { unprotectedRouter, protectedRouter } = require('./router')
const auth = require('./middleware/auth')
const errorHandle = require('./app/errorHandle')

app.use(koaBody())
app.use(unprotectedRouter.routes())
app.use(unprotectedRouter.allowedMethods())
app.use(koaJwt({ secret: SECRET }))
app.use(auth)
app.use(protectedRouter.routes())
app.use(protectedRouter.allowedMethods())

app.on('error', errorHandle)

app.listen(PORT, () => {
  console.log(`服务器在启动成功: http://localhost:${PORT}`)
})
