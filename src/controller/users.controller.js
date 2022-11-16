const jwt = require('jsonwebtoken')

const codes = require('../app/code')
const types = require('../app/constants')
const { SECRET } = require('../app/config')
const usersService = require('../service/users.service')
const sendCodeEmail = require('../utils/email')

class UsersController {
  async signUp(ctx, next) {
    const body = { code: null, msg: null }
    const { username, password, email } = ctx.request.body
    const status = await usersService.signUp(username, password, email)

    if (status) {
      body.code = codes.SUCCESS
      body.msg = types.SUCCESS
    } else {
      body.code = codes.FAILURE
      body.msg = types.FAILURE
    }

    ctx.body = body
  }

  async signIn(ctx, next) {
    const { username } = ctx.request.body
    const { uid } = await usersService.getUserByUsername(username)
    const token = jwt.sign({ uid }, SECRET, { expiresIn: '2h' })

    ctx.body = {
      code: codes.SUCCESS,
      msg: '登陆成功',
      data: {
        uid,
        token,
      },
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

  async resetPwd(ctx, next) {
    const body = { code: codes.SUCCESS, msg: types.SUCCESS }
    const { password } = ctx.request.body
    const { uid } = ctx.meta

    const status = await usersService.resetPwd(uid, password)

    if (!status) {
      body.code = codes.FAILURE
      body.msg = types.FAILURE
    }

    ctx.body = body
  }

  async updatePwd(ctx, next) {
    const body = { code: codes.SUCCESS, msg: types.SUCCESS }
    const { uid, newPassword: password } = ctx.request.body
    const status = await usersService.updatePwd(uid, password)

    if (!status) {
      body.code = codes.FAILURE
      body.msg = types.FAILURE
    }

    ctx.body = body
  }

  async getUserInfo(ctx, next) {
    const { uid } = ctx.request.body
    const user = await usersService.getUserByUID(uid)
    ctx.body = {
      code: codes.SUCCESS,
      msg: types.SUCCESS,
      data: {
        uid,
        username: user.username,
      },
    }
  }
}

module.exports = new UsersController()
