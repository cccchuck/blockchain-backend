/**
 * 日志中间件
 * 记录所有请求日志，便于定位错误及分析
 */
const log4js = require('log4js')
log4js.configure({
  appenders: {
    error: {
      type: 'file',
      filename: './log/error.log',
    },
    normal: {
      type: 'file',
      filename: './log/log.log',
    },
  },
  categories: {
    default: {
      appenders: ['normal'],
      level: 'info',
    },
  },
})

const loggerInfo = log4js.getLogger('normal')
const loggerError = log4js.getLogger('error')

const logger = async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  loggerInfo.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`)
}

module.exports = {
  logger,
  loggerInfo,
  loggerError,
}
