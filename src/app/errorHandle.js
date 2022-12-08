// 错误处理中间件，通过 new Error 抛出错误，由该中间件统一处理错误信息和代码
const types = require('./constants')
const codes = require('./code')
const { loggerError } = require('../middleware/logger')

function errorHandle(error, ctx) {
  let body = {
    code: null,
    msg: null,
  }

  switch (error.message) {
    case types.USER_ALREADY_EXISTS:
      body.code = codes.USER_ALREADY_EXISTS
      body.msg = types.USER_ALREADY_EXISTS
      break
    case types.USER_NOT_EXISTS:
      body.code = codes.USER_NOT_EXISTS
      body.msg = types.USER_NOT_EXISTS
      break
    case types.USERNAME_NOT_MATCH_EMAIL:
      body.code = codes.USERNAME_NOT_MATCH_EMAIL
      body.msg = types.USERNAME_NOT_MATCH_EMAIL
      break
    case types.USERNAME_OR_EMAIL_IS_EMPTY:
      body.code = codes.USERNAME_OR_EMAIL_IS_EMPTY
      body.msg = types.USERNAME_OR_EMAIL_IS_EMPTY
      break
    case types.USERNAME_OR_PASSWORD_IS_INCORRECT:
      body.code = codes.USERNAME_OR_PASSWORD_IS_INCORRECT
      body.msg = types.USERNAME_OR_PASSWORD_IS_INCORRECT
      break
    case types.USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY:
      body.code = codes.USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY
      body.msg = types.USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY
      break
    case types.USERNAME_OR_PASSWORD_OR_CODE_IS_EMPTY:
      body.code = codes.USERNAME_OR_PASSWORD_OR_CODE_IS_EMPTY
      body.msg = types.USERNAME_OR_PASSWORD_OR_CODE_IS_EMPTY
      break

    case types.SEND_CODE_FREQRUNED:
      body.code = codes.SEND_CODE_FREQRUNED
      body.msg = types.SEND_CODE_FREQRUNED
      break
    case types.CODE_INCORRECT:
      body.code = codes.CODE_INCORRECT
      body.msg = types.CODE_INCORRECT
      break
    case types.CODE_EXPIRED:
      body.code = codes.CODE_EXPIRED
      body.msg = types.CODE_EXPIRED
      break
    case types.FOBIDDEN:
      body.code = codes.FOBIDDEN
      body.msg = types.FOBIDDEN
      break
    case types.EITHER_OLDPASSWORD_OR_NEWPASSWORD_IS_EMPTY:
      body.code = codes.EITHER_OLDPASSWORD_OR_NEWPASSWORD_IS_EMPTY
      body.msg = types.EITHER_OLDPASSWORD_OR_NEWPASSWORD_IS_EMPTY
      break
    case types.OLDPASSWORD_ERROR:
      body.code = codes.OLDPASSWORD_ERROR
      body.msg = types.OLDPASSWORD_ERROR
      break
    case types.PASSWORD_FORMAT_ERROR:
      body.code = codes.PASSWORD_FORMAT_ERROR
      body.msg = types.PASSWORD_FORMAT_ERROR
      break
    case types.POOL_NOT_EXIST:
      body.code = codes.POOL_NOT_EXIST
      body.msg = types.POOL_NOT_EXIST
      break
    case types.NOT_ENOUGH_BALANCE:
      body.code = codes.NOT_ENOUGH_BALANCE
      body.msg = types.NOT_ENOUGH_BALANCE
      break
    case types.TOEKN_ID_IS_EMPTY:
      body.code = codes.TOEKN_ID_IS_EMPTY
      body.msg = types.TOEKN_ID_IS_EMPTY
      break
    case types.TOKEN_NOT_EXISTS:
      body.code = codes.TOKEN_NOT_EXISTS
      body.msg = types.TOKEN_NOT_EXISTS
      break
    case types.TOKEN_ID_OR_NUMBER_IS_EMPTY:
      body.code = codes.TOKEN_ID_OR_NUMBER_IS_EMPTY
      body.msg = types.TOKEN_ID_OR_NUMBER_IS_EMPTY
      break
    case types.THE_TOKEN_NOT_EXISTS:
      body.code = codes.THE_TOKEN_NOT_EXISTS
      body.msg = types.THE_TOKEN_NOT_EXISTS
      break
    case types.TOKEN_ID_OR_STAKE_NUMBER_IS_EMPTY:
      body.code = codes.TOKEN_ID_OR_STAKE_NUMBER_IS_EMPTY
      body.msg = types.TOKEN_ID_OR_STAKE_NUMBER_IS_EMPTY
      break
    case types.UID_OR_STAKE_ID_IS_EMPTY:
      body.code = codes.UID_OR_STAKE_ID_IS_EMPTY
      body.msg = types.UID_OR_STAKE_ID_IS_EMPTY
      break
    case types.UID_STAKE_ID_NOT_MATCHED:
      body.code = codes.UID_STAKE_ID_NOT_MATCHED
      body.msg = types.UID_STAKE_ID_NOT_MATCHED
      break
    case types.STAKE_ID_NOT_EXIST:
      body.code = codes.STAKE_ID_NOT_EXIST
      body.msg = types.STAKE_ID_NOT_EXIST
      break
    case types.EXPIRED:
      body.code = codes.EXPIRED
      body.msg = types.EXPIRED
      break
    default:
      body.code = codes.INTERNAL_FAILURE
      body.msg = types.INTERNAL_FAILURE
  }

  ctx.body = body

  loggerError.error(`${ctx.method} ${ctx.url} ${ctx.status} - ${error.message}`)
}

module.exports = errorHandle
