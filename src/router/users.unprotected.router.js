const Router = require('@koa/router')

const usersController = require('../controller/users.controller')

const usersMiddleware = require('../middleware/users.middleware')

const usersRouter = new Router({
  prefix: '/users',
})

usersRouter.post(
  '/sign-up',
  usersMiddleware.verifyUserSignUp,
  usersController.signUp
)

usersRouter.post(
  '/sign-in',
  usersMiddleware.verifyUserSignIn,
  usersController.signIn
)

usersRouter.post(
  '/send-code',
  usersMiddleware.verifySendCode,
  usersController.sendCode
)

usersRouter.post(
  '/reset-pwd',
  usersMiddleware.verifyResetPwd,
  usersController.resetPwd
)

module.exports = usersRouter
