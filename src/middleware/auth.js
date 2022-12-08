/**
 * 鉴权中间件
 * 本项目鉴权方式为 JWT，而不是 cookie，至于 cookie 的利弊在此不再阐述
 * 在该中间件中通过用户请求中 requset header 的 Authorization 字段传过来的 token
 * 来验证用户登录是否合法、用户登录是否已过期、等等等等
 */
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
