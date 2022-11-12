const userService = require('../service/users.service')

class UsersController {
  async getAllUser(ctx, next) {
    const result = await userService.getAllUsers()
    ctx.body = result
  }

  async signUp(ctx, next) {
    const { username, password, email } = ctx.request.body
    const result = await userService.signUp(username, password, email)
    ctx.body = result
  }
}

module.exports = new UsersController()
