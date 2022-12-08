/**
 * 跨域中间件
 * 通过该中间件设置跨域
 */
const setCors = async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:5173')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept'
  )
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

  if (ctx.method === 'OPTIONS') {
    ctx.body = ''
  } else {
    await next()
  }
}

module.exports = setCors
