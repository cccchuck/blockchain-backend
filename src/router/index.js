const Router = require('@koa/router')

const usersRouter = require('./users.router')

const unprotectedRouter = new Router()
const protectedRouter = new Router()

unprotectedRouter.use(usersRouter.routes(), usersRouter.allowedMethods())

console.log(unprotectedRouter)

module.exports = { unprotectedRouter, protectedRouter }
