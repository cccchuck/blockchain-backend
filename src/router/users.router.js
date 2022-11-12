const Router = require('@koa/router')

const usersController = require('../controller/users.controller')

const usersMiddleware = require('../middleware/users.middleware')

const usersRouter = new Router({
  prefix: '/users',
})

usersRouter.get('/get-all-user', usersController.getAllUser)

usersRouter.post('/sign-up', usersMiddleware.verifyUser, usersController.signUp)

module.exports = usersRouter