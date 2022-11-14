const Router = require('@koa/router')

const usersUnprotectedRouter = require('./users.unprotected.router')
const usersProtectedRouter = require('./users.protected.router')

const tokenRouter = require('./token.router')

const unprotectedRouter = new Router()
const protectedRouter = new Router()

unprotectedRouter.use(
  usersUnprotectedRouter.routes(),
  usersUnprotectedRouter.allowedMethods(),
)

protectedRouter.use(
  usersProtectedRouter.routes(),
  usersProtectedRouter.allowedMethods(),
  tokenRouter.routes(),
  tokenRouter.allowedMethods(),
)

module.exports = { unprotectedRouter, protectedRouter }
