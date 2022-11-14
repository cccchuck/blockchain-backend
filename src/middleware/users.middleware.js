const types = require('../app/constants')

const usersService = require('../service/users.service')
const { comparePassword } = require('../utils/crypto')

async function verifyUserSignUp(ctx, next) {
  const { username, password, email } = ctx.request.body

  // 用户名，密码，邮箱为空
  if (!username || !password || !email) {
    const err = new Error(types.USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 用户已存在
  const user = await usersService.getUserByUsername(username)
  if (user) {
    const err = new Error(types.USER_ALREADY_EXISTS)
    ctx.app.emit('error', err, ctx)
    return
  }

  await next()
}

async function verifyUserSignIn(ctx, next) {
  const { username, password } = ctx.request.body

  // 用户名或密码为空
  if (!username || !password) {
    const err = new Error(types.USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 用户不存在
  const user = await usersService.getUserByUsername(username)
  if (!user) {
    const err = new Error(types.USER_NOT_EXISTS)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 账户密码不对
  if (!comparePassword(password, user.password)) {
    const err = new Error(types.USERNAME_OR_PASSWORD_IS_INCORRECT)
    ctx.app.emit('error', err, ctx)
    return
  }

  await next()
}

async function verifySendCode(ctx, next) {
  const { username, email } = ctx.request.body

  // 用户名或邮箱为空
  if (!username || !email) {
    const err = new Error(types.USERNAME_OR_EMAIL_IS_EMPTY)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 用户名与邮箱不匹配
  const user = await usersService.getUserByUsername(username)
  if (email !== user.email) {
    const err = new Error(types.USERNAME_NOT_MATCH_EMAIL)
    ctx.app.emit('error', err, ctx)
    return
  }

  const { uid } = await usersService.getUserByUsername(username)
  const result = await usersService.getResetCodeByID(uid)
  if (result.length) {
    const { updateTime } = result[0]
    // 发送邮件过于频繁
    if (Date.now() - updateTime.getTime() < 60 * 1000) {
      const err = new Error(types.SEND_CODE_FREQRUNED)
      ctx.app.emit('error', err, ctx)
      return
    }
  }

  ctx.meta = { uid, exist: result.length > 0 }
  await next()
}

module.exports = {
  verifyUserSignUp,
  verifyUserSignIn,
  verifySendCode,
}
