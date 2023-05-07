const { body, validationResult } = require('express-validator');

// example 
// exports.register = [
// check('email').isEmail(),
// (req, res, next) => { /* the rest of the existing function */ }
// ]
const userValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('姓名不能為空白')
    .bail() //第一個條件不通過 不繼續檢查
    .isLength({ min: 2, max: 20 }).withMessage('姓名至少需兩個字以上，最多二十個字')
  ,
  body('email')
    .isEmail().withMessage('必須是合法email')
    .bail()
    .isLength({ max: 32 })
  ,
  body('password').trim().isLength({ min: 6, max: 32 }).withMessage('密碼長度至少六位'),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      // 確認密碼欄位的值需要和密碼欄位的值相符
      if (value !== req.body.password) {
        // 驗證失敗時的錯誤訊息
        throw new Error('兩次輸入的密碼不相同')
      }
      // 成功驗證回傳 true
      return true
    }),
  (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.render('register', {
        errors: result.array(),
        name,
        email,
        password,
        confirmPassword,
      })
    }
    next()
  }
]

const todoValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('名稱不能為空白')
    .bail() //第一個條件不通過 不繼續檢查
    .isLength({ min: 2, max: 20 }).withMessage('名稱至少需兩個字以上，最多二十個字'),
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      if (!req.params.id) {
        return res.render('new', {
          errors: result.array(),
          name: req.body.name
        })
      } else {
        const id = req.params.id
        const todo = Object.assign({ id }, req.body)
        return res.render('edit', {
          errors: result.array(),
          todo
        })
      }

    }
    next()
  }
]

module.exports = { todoValidator, userValidator }