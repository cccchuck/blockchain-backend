const dotenv = require('dotenv')

dotenv.config()

const {
  PORT,
  SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env

module.exports = {
  PORT,
  SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
}
