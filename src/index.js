/**
 * 本项目为 BlockChain 配套的后端项目
 * 项目采用 Koa 进行开发，整体比较简单
 * 阅读本项目代码需要你掌握以下知识:
 *  - 熟悉 Node.js, 熟悉 ES6 及以后语法
 *  - 熟悉 koa，了解其中间件的思想
 * 该后端项目相对前端来说比较简单
 * 因为没有涉及到高并发，因此只是一些对数据库简单的增删改查
 * 但本项目的代码写的相对来说比较规范，耦合度极低！！！
 * 我在关键的地方都标记了注释，如果你对某一块代码产生了异议
 * 欢迎通过以下两种方式告知我:
 * - 📧 发送邮件至: chuckgao0223@gmail.com
 * - 🐙 在 Github 提 issue: https://github.com/cccchuck/blockchain-backend
 */
const { koaBody } = require('koa-body')

const { logger } = require('./middleware/logger')
const auth = require('./middleware/auth')
const cors = require('./middleware/cors')
const errorHandle = require('./app/errorHandle')

const app = require('./app')
const { PORT } = require('./app/config')
const { unprotectedRouter, protectedRouter } = require('./router')

app.use(logger)
app.use(cors)
app.use(koaBody())
app.use(unprotectedRouter.routes())
app.use(unprotectedRouter.allowedMethods())
app.use(auth)
app.use(protectedRouter.routes())
app.use(protectedRouter.allowedMethods())

app.on('error', errorHandle)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器启动成功: http://localhost:${PORT}`)
})
