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

  // 用户不存在
  const user = await usersService.getUserByUsername(username)
  if (!user) {
    const err = new Error(types.USER_NOT_EXISTS)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 用户名与邮箱不匹配
  if (email !== user.email) {
    const err = new Error(types.USERNAME_NOT_MATCH_EMAIL)
    ctx.app.emit('error', err, ctx)
    return
  }

  const { uid } = user
  const _user = await usersService.getResetCodeByID(uid)
  if (_user) {
    const { updateTime } = _user
    // 发送邮件过于频繁
    if (Date.now() - updateTime.getTime() < 60 * 1000) {
      const err = new Error(types.SEND_CODE_FREQRUNED)
      ctx.app.emit('error', err, ctx)
      return
    }
  }

  ctx.meta = { uid, exist: user !== undefined }
  await next()
}

async function verifyResetPwd(ctx, next) {
  const { username, password, code } = ctx.request.body

  // 用户名，密码或验证码内容为空
  if (!username || !password || !code) {
    const err = new Error(types.USERNAME_OR_EMAIL_IS_EMPTY)
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

  // 验证码错误
  const { uid } = user
  const { code: _code, updateTime } = await usersService.getResetCodeByID(uid)
  if (code !== _code) {
    const err = new Error(types.CODE_INCORRECT)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 验证码过期
  if (Date.now() - updateTime > 30 * 60 * 1000) {
    const err = new Error(types.CODE_EXPIRED)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 新密码格式不符合要求
  const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/
  if (!reg.test(password)) {
    const err = new Error(types.PASSWORD_FORMAT_ERROR)
    ctx.app.emit('error', err, ctx)
    return
  }

  ctx.meta = { uid }
  await next()
}

async function verifyUpdatePwd(ctx, next) {
  const { uid, oldPassword, newPassword } = ctx.request.body

  // uid ，旧密码或新密码为空
  if (!uid || !oldPassword || !newPassword) {
    const err = new Error(types.EITHER_OLDPASSWORD_OR_NEWPASSWORD_IS_EMPTY)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 旧密码错误
  const { password } = await usersService.getUserByUID(uid)
  if (!comparePassword(oldPassword, password)) {
    const err = new Error(types.OLDPASSWORD_ERROR)
    ctx.app.emit('error', err, ctx)
    return
  }

  // 新密码不符合规范
  const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/
  if (!reg.test(newPassword)) {
    const err = new Error(types.PASSWORD_FORMAT_ERROR)
    ctx.app.emit('error', err, ctx)
    return
  }

  await next()
}

async function verifyGetUserInfo(ctx, next) {
  await next()
}

module.exports = {
  verifyUserSignUp,
  verifyUserSignIn,
  verifySendCode,
  verifyResetPwd,
  verifyUpdatePwd,
  verifyGetUserInfo,
}
