const Router = require('@koa/router')

const tokenController = require('../controller/token.controller')

const tokenMiddleware = require('../middleware/token.middleware')

const tokenRouter = new Router({
  prefix: '/token',
})

tokenRouter.post('/swap', tokenMiddleware.verifySwap, tokenController.swap)

tokenRouter.post('/stake', tokenMiddleware.verifyStake, tokenController.stake)

tokenRouter.post(
  '/pre-swap',
  tokenMiddleware.verifyPreSwap,
  tokenController.preSwap,
)

tokenRouter.post('/stake', tokenMiddleware.verifyStake, tokenController.stake)

tokenRouter.post(
  '/unstake',
  tokenMiddleware.verifyUnstake,
  tokenController.unstake,
)

tokenRouter.post(
  '/get-staked',
  tokenMiddleware.verifyGetStaked,
  tokenController.getStaked,
)

tokenRouter.post(
  '/get-token-balance',
  tokenMiddleware.verifyGetTokenBalance,
  tokenController.getTokenBalance,
)

tokenRouter.post(
  '/get-balance',
  tokenMiddleware.verifyGetBalance,
  tokenController.getBalance,
)

module.exports = tokenRouter
