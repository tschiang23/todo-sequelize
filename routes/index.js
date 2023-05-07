const router = require('express').Router()
const home = require('./modules/home')
const users = require('./modules/users')
const todos = require('./modules/todos')
const auth = require('./modules/auth')
const { authecticator } = require('../middleware/auth')

router.use('/users', users)
router.use('/auth', auth)
router.use('/todos', authecticator, todos)
router.use('/', authecticator, home)

module.exports = router