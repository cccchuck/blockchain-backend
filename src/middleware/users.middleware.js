const types = require('../app/constants')

const usersService = require('../service/users.service')

async function verifyUser(ctx, next) {
  const { username, password, email } = ctx.request.body
  if (!username || !password || !email) {
    const err = new Error(types.USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY)
    ctx.app.emit('error', err, ctx)
    return
  }

  const result = await usersService.getUserByUsername(username)
  if (result.length) {
    const err = new Error(types.USER_ALREADY_EXISTS)
    ctx.app.emit('error', err, ctx)
    return
  }

  await next()
}

module.exports = {
  verifyUser,
}
