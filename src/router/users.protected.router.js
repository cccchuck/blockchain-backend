const Router = require('@koa/router')

const usersController = require('../controller/users.controller')

const usersMiddleware = require('../middleware/users.middleware')

const usersRouter = new Router({
  prefix: '/users',
})

usersRouter.post(
  '/update-pwd',
  usersMiddleware.verifyUpdatePwd,
  usersController.updatePwd,
)

usersRouter.post(
  '/get-user-info',
  usersMiddleware.verifyGetUserInfo,
  usersController.getUserInfo,
)

module.exports = usersRouter
