const { type } = require('os')
const types = require('./constants')

function errorHandle(error, ctx) {
  let status
  let body = {
    errCode: null,
    errMsg: null,
  }

  switch (error.message) {
    case types.USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY:
      status = 400
      body.errCode = 400
      body.errMsg = '用户名，密码或邮箱不能为空'
      break
    case types.USER_ALREADY_EXISTS:
      status = 409
      body.errCode = 409
      body.errMsg = '该用户已存在'
      break
    default:
      status = 400
      body.errCode = 400
      body.errMsg = '请求出错'
  }

  ctx.status = status
  ctx.body = body
}

module.exports = errorHandle
