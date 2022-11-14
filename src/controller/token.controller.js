const codes = require('../app/code')
const types = require('../app/constants')

const tokenService = require('../service/token.service')

class TokenController {
  async swap(ctx, next) {
    const body = { code: codes.SUCCESS, msg: types.SUCCESS }
    const { uid, fromTokenId, fromTokenNumber, toTokenId } = ctx.request.body

    const pool = await tokenService.getTokenPool(fromTokenId, toTokenId)
    const product = pool.fromTokenNumber * pool.toTokenNumber
    const poolToTokenNumber = product / (pool.fromTokenNumber - fromTokenNumber)
    const willReceiveTokenNumber = poolToTokenNumber - pool.toTokenNumber

    const status = await tokenService.swapToken(
      fromTokenId,
      fromTokenNumber,
      toTokenId,
      willReceiveTokenNumber,
      uid,
      pool,
    )

    if (!status) {
      body.code = codes.FAILURE
      body.msg = types.FAILURE
    }

    ctx.body = body
  }

  async stake(ctx, next) {}

  async unstake(ctx, next) {}

  async getStaked(ctx, next) {
    const body = {
      code: codes.SUCCESS,
      msg: types.SUCCESS,
      data: [],
    }
    const { uid } = ctx.request.body
    const result = await tokenService.getStaked(uid)

    if (result.length) {
      body.data = result
    }

    ctx.body = body
  }

  async getTokenBalance(ctx, next) {
    const body = {
      code: codes.SUCCESS,
      msg: types.SUCCESS,
      data: { balance: null },
    }
    const { uid, tokenId } = ctx.request.body
    const result = await tokenService.getUserTokenBalanceByID(uid, tokenId)

    if (!result) {
      body.data.balance = 0
    } else {
      body.data.balance = result.balance
    }

    ctx.body = body
  }

  async getBalance(ctx, next) {
    const body = { code: codes.SUCCESS, msg: types.SUCCESS, data: [] }
    const { uid } = ctx.request.body
    const result = await tokenService.getUserTokenBalance(uid)

    if (result.length) {
      result.forEach((token) => {
        const {
          tokenId,
          tokenName,
          tokenLogo,
          balance,
          fromTokenNumber,
          toTokenNumber,
        } = token
        const price = parseFloat((toTokenNumber / fromTokenNumber).toFixed(6))
        body.data.push({
          tokenId,
          tokenName,
          tokenLogo,
          tokenPrice: price,
          tokenBalance: balance,
        })
      })
    }
    ctx.body = body
  }

  async preSwap(ctx, next) {
    const { fromTokenNumber } = ctx.request.body

    const body = {
      code: codes.SUCCESS,
      msg: types.SUCCESS,
      data: {
        time: null,
        fromTokenNumber: fromTokenNumber,
        willReceiveTokenNumber: null,
      },
    }
    const { pool } = ctx.token
    const product = pool.fromTokenNumber * pool.toTokenNumber
    const poolToTokenNumber = product / (pool.fromTokenNumber - fromTokenNumber)

    body.data.willReceiveTokenNumber = parseFloat(
      (poolToTokenNumber - pool.toTokenNumber).toFixed(6),
    )
    body.data.time = new Date().getTime()
    ctx.body = body
  }
}

module.exports = new TokenController()
