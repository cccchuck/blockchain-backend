const jwt = require('jsonwebtoken')

const codes = require('../app/code')
const types = require('../app/constants')
const { SECRET } = require('../app/config')
const usersService = require('../service/users.service')
const sendCodeEmail = require('../utils/email')

class UsersController {
  async getAllUser(ctx, next) {
    const result = await usersService.getAllUsers()
    ctx.body = result
  }

  async signUp(ctx, next) {
    const body = { code: null, body: null }
    const { username, password, email } = ctx.request.body
    const result = await usersService.signUp(username, password, email)

    if (result.length) {
      body = {
        code: codes.SUCCESS,
        msg: '注册成功',
      }
    } else {
      body = {
        code: codes.FAILURE,
        msg: '注册失败',
      }
    }

    ctx.body = body
  }

  async signIn(ctx, next) {
    const { username } = ctx.request.body
    const { id } = await usersService.getUserByUsername(username)

    const token = jwt.sign(id, SECRET, { expiresIn: '2h' })

    ctx.set('Authorization', token)
    ctx.body = {
      code: codes.SUCCESS,
      msg: '登陆成功',
    }
  }

  async sendCode(ctx, next) {
    const body = { code: codes.SUCCESS, msg: types.SUCCESS }
    const { username, email } = ctx.request.body
    const { uid, exist } = ctx.meta
    const { code, status } = await sendCodeEmail(username, email)

    if (status) {
      const result = await usersService.setResetCodeByID(uid, code, exist)
      if (!result) {
        body.code = codes.FAILURE
        body.msg = types.FAILURE
      }
    } else {
      body.code = codes.FAILURE
      body.msg = types.FAILURE
    }

    ctx.body = body
  }
}

module.exports = new UsersController()
