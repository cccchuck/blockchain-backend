const jwt = require('jsonwebtoken')

const types = require('../app/constants')

async function verifyAuth(ctx, next) {
  const { authorization } = ctx.request.header

  let uid, exp

  try {
    ;({ uid, exp } = jwt.decode(authorization.slice(7)))
  } catch (error) {
    const err = new Error(types.EXPIRED)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 登录过期
  if (exp * 1000 < Date.now()) {
    const err = new Error(types.EXPIRED)
    ctx.app.emit('error', err, ctx)
    return
  }

  const bodyUid = ctx.request.body.uid

  // 非法请求
  if (uid !== bodyUid) {
    const err = new Error(types.FOBIDDEN)
    ctx.app.emit('error', err, ctx)
    return
  }

  await next()
}

module.exports = verifyAuth
