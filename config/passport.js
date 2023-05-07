const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return done(null, false, req.flash('warning_msg', '帳號密碼不正確'))
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return done(null, false, req.flash('warning_msg', '帳號密碼不正確'))
      }

      return done(null, user)
    } catch (err) {
      return done(err, false)
    }
  }))

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // console.log(profile)
          const { name, email } = profile._json

          const foundUser = await User.findOne({ where: { email } })
          if (foundUser) return done(null, foundUser)

          const randomPassword = Math.random().toString(36).slice(-8)

          const hash = await bcrypt.hash(randomPassword, 10)

          const createdUser = await User.create({ name, email, password: hash })
          return done(null, createdUser)
        } catch (err) {
          return done(err, false)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findByPk(id)
      user = user.toJSON()
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}