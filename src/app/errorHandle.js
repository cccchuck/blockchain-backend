const types = require('./constants')
const codes = require('./code')

function errorHandle(error, ctx) {
  let body = {
    code: null,
    msg: null,
  }

  switch (error.message) {
    case types.USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY:
      body.code = codes.USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY
      body.msg = types.USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY
      break
    case types.USER_ALREADY_EXISTS:
      body.code = codes.USER_ALREADY_EXISTS
      body.msg = types.USER_ALREADY_EXISTS
      break
    case types.USER_NOT_EXISTS:
      body.code = codes.USER_NOT_EXISTS
      body.msg = types.USER_NOT_EXISTS
      break
    case types.USERNAME_OR_PASSWORD_IS_INCORRECT:
      body.code = codes.USERNAME_OR_PASSWORD_IS_INCORRECT
      body.msg = types.USERNAME_OR_PASSWORD_IS_INCORRECT
      break
    case types.USERNAME_OR_EMAIL_IS_EMPTY:
      body.code = codes.USERNAME_OR_EMAIL_IS_EMPTY
      body.msg = types.USERNAME_OR_EMAIL_IS_EMPTY
      break
    case types.USERNAME_NOT_MATCH_EMAIL:
      body.code = codes.USERNAME_NOT_MATCH_EMAIL
      body.msg = types.USERNAME_NOT_MATCH_EMAIL
      break
    case types.SEND_CODE_FREQRUNED:
      body.code = codes.SEND_CODE_FREQRUNED
      body.msg = types.SEND_CODE_FREQRUNED
      break
    default:
      body.code = codes.INTERNAL_FAILURE
      body.msg = types.INTERNAL_FAILURE
  }

  ctx.body = body
}

module.exports = errorHandle
