// email 文件，控制发送邮件
const nodemailer = require('nodemailer')
const { EMAIL_USER, EMAIL_PASS } = require('../app/config')

const transporet = nodemailer.createTransport({
  host: 'smtp.126.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
})

function generateCode() {
  let result = ''
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * 10)
    result += digits[index]
  }

  return result
}

async function sendCodeEmail(username, email) {
  const code = generateCode()
  const result = { code, status: true }
  const mail = {
    from: `"BlockChain" <${EMAIL_USER}>`,
    to: email,
    subject: '【BlockChain】重置密码验证码',
    text: `【BlockChain】尊敬的 ${username} 您好，您的验证码为: ${code}，验证码 30 分钟内有效。如果这不是您本人的操作，请联系我们。`,
  }

  try {
    const info = await transporet.sendMail(mail)
    if (!info.accepted.length) result.status = false
  } catch (error) {
    result.status = false
  }

  return result
}

module.exports = sendCodeEmail
