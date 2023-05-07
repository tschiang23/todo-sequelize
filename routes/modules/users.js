const router = require('express').Router()
const db = require('../../models')
const User = db.User
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { userValidator } = require('../../middleware/validator');

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true,
}))

router.post('/register', userValidator, async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const user = await User.findOne({ where: { email } })

    if (user) {
      req.flash('warning_msg', '帳號已被註冊')
      return res.redirect('/users/register')
      // return res.render('register', { ...req.body })
    }

    const hash = await bcrypt.hash(password, 10)
    await User.create({
      name,
      email,
      password: hash
    })
    req.flash('success_msg', '帳號註冊成功')
    res.redirect('/users/register')
  } catch (err) {
    res.status(422).json(err)
  }
})

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router