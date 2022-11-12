const userService = require('../service/users.service')

class UsersController {
  async getAllUser(ctx, next) {
    const result = await userService.getAllUsers()
    ctx.body = result
  }

  async signUp(ctx, next) {
    console.log(ctx.request.body)
    const { username, password, email } = ctx.request.body
    console.log(username, password, email)
    const result = await userService.signUp(username, password, email)
    ctx.body = result
  }
}

module.exports = new UsersController()
