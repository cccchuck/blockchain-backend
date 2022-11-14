const jwt = require('jsonwebtoken')

const types = require('../app/constants')

async function verifyAuth(ctx, next) {
  const { authorization } = ctx.request.header

  const { uid } = jwt.decode(authorization.slice(7))
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
