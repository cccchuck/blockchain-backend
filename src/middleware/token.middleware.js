const types = require('../app/constants')

const usersService = require('../service/users.service')
const tokenService = require('../service/token.service')

async function verifyGetTokenList(ctx, next) {
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
  if (!userBalance || userBalance.balance < fromTokenNumber) {
    const err = new Error(types.NOT_ENOUGH_BALANCE)
    ctx.app.emit('error', err, ctx)
    return
  }

  await next()
}

async function verifyStake(ctx, next) {
  const { uid, tokenId, tokenNumber } = ctx.request.body

  // 1. 字段是否存在
  if (!tokenId || !tokenNumber) {
    const err = new Error(types.TOKEN_ID_OR_STAKE_NUMBER_IS_EMPTY)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 2. Token 不存在
  const token = await tokenService.getTokenByID(tokenId)
  if (!token) {
    const err = new Error(types.THE_TOKEN_NOT_EXISTS)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 3. 余额不足
  const result = await tokenService.getUserTokenBalanceByID(uid, tokenId)
  if (result.balance < tokenNumber) {
    const err = new Error(types.NOT_ENOUGH_BALANCE)
    ctx.app.emit('error', err, ctx)
    return
  }

  await next()
}

async function verifyGetStake(ctx, next) {
  await next()
}

async function verifyGetStaked(ctx, next) {
  await next()
}

async function verifyUnstake(ctx, next) {
  const { uid, stakeId } = ctx.request.body

  // 1. 字段为空
  if (!uid || !stakeId) {
    const err = new Error(types.UID_OR_STAKE_ID_IS_EMPTY)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 2. UID 不存在
  const user = await usersService.getUserByUID(uid)
  if (!user) {
    const err = new Error(types.USER_NOT_EXISTS)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 3. stakeId 不存在
  const result = await tokenService.getStakedById(stakeId)
  if (!result.length) {
    const err = new Error(types.STAKE_ID_NOT_EXIST)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 4. UID stakeId 不匹配
  const { uid: _uid } = result[0]
  if (uid !== _uid) {
    const err = new Error(types.STAKE_ID_NOT_EXIST)
    ctx.app.emit('error', err, ctx)
    return
  }

  await next()
}

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

module.exports = {
  verifySwap,
  verifyStake,
  verifyUnstake,
  verifyPreSwap,
  verifyGetStake,
  verifyGetStaked,
  verifyGetBalance,
  verifyGetTokenList,
  verifyGetTokenBalance,
}
