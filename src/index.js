const koaJwt = require('koa-jwt')
const { koaBody } = require('koa-body')

const { logger } = require('./middleware/logger')
const auth = require('./middleware/auth')
const errorHandle = require('./app/errorHandle')

const app = require('./app')
const { PORT, SECRET } = require('./app/config')
const { unprotectedRouter, protectedRouter } = require('./router')

app.use(logger)
app.use(koaBody())
app.use(unprotectedRouter.routes())
app.use(unprotectedRouter.allowedMethods())
app.use(koaJwt({ secret: SECRET }))
app.use(auth)
app.use(protectedRouter.routes())
app.use(protectedRouter.allowedMethods())

app.on('error', errorHandle)

app.listen(PORT, () => {
  console.log(`服务器启动成功: http://localhost:${PORT}`)
})
