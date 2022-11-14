const Router = require('@koa/router')

const usersUnprotectedRouter = require('./users.unprotected.router')
const usersProtectedRouter = require('./users.protected.router')

const unprotectedRouter = new Router()
const protectedRouter = new Router()

unprotectedRouter.use(
  usersUnprotectedRouter.routes(),
  usersUnprotectedRouter.allowedMethods()
)

protectedRouter.use(
  usersProtectedRouter.routes(),
  usersProtectedRouter.allowedMethods()
)

module.exports = { unprotectedRouter, protectedRouter }
