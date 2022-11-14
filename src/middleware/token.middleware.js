const codes = require('../app/code')
const types = require('../app/constants')

const tokenService = require('../service/token.service')

async function verifySwap(ctx, next) {
  const { uid, fromTokenId, fromTokenNumber, toTokenId } = ctx.request.body

  // 1. 验证字段是否为空
  if (!fromTokenId || !fromTokenNumber || !toTokenId) {
    const err = new Error(types.TOKEN_ID_OR_NUMBER_IS_EMPTY)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 2. Token 不存在
  const fromToken = await tokenService.getTokenByID(fromTokenId)
  const toToken = await tokenService.getTokenByID(toTokenId)
  if (!fromToken || !toToken) {
    const err = new Error(types.TOKEN_NOT_EXISTS)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 3. Pool 不存在
  const pool = await tokenService.getTokenPool(fromTokenId, toTokenId)
  if (!pool) {
    const err = new Error(types.POOL_NOT_EXIST)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 4. 验证余额
  const userBalance = await tokenService.getUserTokenBalanceByID(
    uid,
    fromTokenId,
  )
  if (!userBalance || userBalance < fromTokenNumber) {
    const err = new Error(types.NOT_ENOUGH_BALANCE)
    ctx.app.emit('error', err, ctx)
    return
  }

  await next()
}

async function verifyStake(ctx, next) {}

async function verifyGetStaked(ctx, next) {
  await next()
}

async function verifyUnstake(ctx, next) {}

async function verifyGetTokenBalance(ctx, next) {
  const { tokenId } = ctx.request.body

  const token = await tokenService.getTokenByID(tokenId)
  if (!token) {
    const err = new Error(types.THE_TOKEN_NOT_EXISTS)
    ctx.app.emit('error', err, ctx)
    return
  }

  await next()
}

async function verifyGetBalance(ctx, next) {
  await next()
}

async function verifyPreSwap(ctx, next) {
  const { fromTokenId, toTokenId, fromTokenNumber } = ctx.request.body

  // 1. 验证字段是否为空
  if (!fromTokenId || !fromTokenNumber || !toTokenId) {
    const err = new Error(types.TOKEN_ID_OR_NUMBER_IS_EMPTY)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 2. Token 不存在
  const fromToken = await tokenService.getTokenByID(fromTokenId)
  const toToken = await tokenService.getTokenByID(toTokenId)
  if (!fromToken || !toToken) {
    const err = new Error(types.TOKEN_NOT_EXISTS)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 3. Pool 不存在
  const pool = await tokenService.getTokenPool(fromTokenId, toTokenId)
  if (!pool) {
    const err = new Error(types.POOL_NOT_EXIST)
    ctx.app.emit('error', err, ctx)
    return
  }

  ctx.token = { pool }

  await next()
}

module.exports = {
  verifySwap,
  verifyStake,
  verifyUnstake,
  verifyPreSwap,
  verifyGetStaked,
  verifyGetTokenBalance,
  verifyGetBalance,
}
