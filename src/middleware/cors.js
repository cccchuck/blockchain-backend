const setCors = async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://10.131.1.115:5173')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept',
  )
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

  if (ctx.method === 'OPTIONS') {
    ctx.body = ''
  } else {
    await next()
  }
}

module.exports = setCors
