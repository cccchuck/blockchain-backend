const SUCCESS = 20000
const FAILURE = 40000
const FOBIDDEN = 40003
const INTERNAL_FAILURE = 50000

const CODE_EXPIRED = 40000
const CODE_INCORRECT = 40000
const SEND_CODE_FREQRUNED = 40009

const UID_IS_EMPTY = 40000
const USER_NOT_EXISTS = 40004
const USER_ALREADY_EXISTS = 40009
const OLDPASSWORD_ERROR = 40000
const PASSWORD_FORMAT_ERROR = 40000

const USERNAME_NOT_MATCH_EMAIL = 40000
const USERNAME_OR_EMAIL_IS_EMPTY = 40000
const USERNAME_OR_PASSWORD_IS_EMPTY = 40000
const USERNAME_OR_PASSWORD_IS_INCORRECT = 40000
const USERNAME_OR_PASSWORD_OR_CODE_IS_EMPTY = 40000
const USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY = 40000
const EITHER_OLDPASSWORD_OR_NEWPASSWORD_IS_EMPTY = 40000

const TOKEN_NOT_EXISTS = 40000
const TOEKN_ID_IS_EMPTY = 40000
const THE_TOKEN_NOT_EXISTS = 40000
const TOKEN_ID_OR_NUMBER_IS_EMPTY = 40000
const TOKEN_ID_OR_STAKE_NUMBER_IS_EMPTY = 40000

const POOL_NOT_EXIST = 40004
const NOT_ENOUGH_BALANCE = 40000
const STAKE_ID_NOT_EXIST = 40000
const UID_OR_STAKE_ID_IS_EMPTY = 40000
const UID_STAKE_ID_NOT_MATCHED = 40000

module.exports = {
  SUCCESS,
  FAILURE,
  FOBIDDEN,
  INTERNAL_FAILURE,

  CODE_EXPIRED,
  CODE_INCORRECT,
  SEND_CODE_FREQRUNED,

  POOL_NOT_EXIST,
  STAKE_ID_NOT_EXIST,

  UID_IS_EMPTY,
  USER_NOT_EXISTS,
  USER_ALREADY_EXISTS,
  USERNAME_NOT_MATCH_EMAIL,
  USERNAME_OR_EMAIL_IS_EMPTY,
  USERNAME_OR_PASSWORD_IS_EMPTY,
  USERNAME_OR_PASSWORD_IS_INCORRECT,
  USERNAME_OR_PASSWORD_OR_CODE_IS_EMPTY,
  USERNAME_OR_PASSWORD_OR_EMAIL_IS_EMPTY,

  OLDPASSWORD_ERROR,
  PASSWORD_FORMAT_ERROR,
  EITHER_OLDPASSWORD_OR_NEWPASSWORD_IS_EMPTY,

  TOKEN_NOT_EXISTS,
  TOEKN_ID_IS_EMPTY,
  THE_TOKEN_NOT_EXISTS,
  TOKEN_ID_OR_NUMBER_IS_EMPTY,
  TOKEN_ID_OR_STAKE_NUMBER_IS_EMPTY,

  NOT_ENOUGH_BALANCE,

  UID_OR_STAKE_ID_IS_EMPTY,
  UID_STAKE_ID_NOT_MATCHED,
}
