const Router = require('@koa/router')

const usersController = require('../controller/users.controller')

const usersRouter = new Router({
  prefix: '/users',
})

usersRouter.get('/get-all-user', usersController.getAllUser)

usersRouter.post('/sign-up', usersController.signUp)

module.exports = usersRouter
