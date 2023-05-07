const router = require('express').Router()
const db = require('../../models')
const Todo = db.Todo
const { todoValidator } = require('../../middleware/validator')

// new page
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', todoValidator, async (req, res) => {
  try {
    await Todo.create({
      name: req.body.name,
      UserId: req.user.id,
    })
    req.flash('success_msg', '成功新增Todo')
    res.redirect('/')
  } catch (err) {
    res.status(422).json(err)
  }
})


//edit
router.get('/:id/edit', async (req, res) => {
  try {
    const id = req.params.id
    const todo = await Todo.findByPk(id, { raw: true })
    res.render('edit', { todo })
  } catch (err) {
    res.status(422).json(err)
  }
})

router.put('/:id', todoValidator, async (req, res) => {
  try {
    const id = req.params.id
    const todo = await Todo.findByPk(id)
    await todo.set({ name: req.body.name })
    await todo.save()
    req.flash('success_msg', '成功編輯Todo')
    res.redirect('/')
  } catch (err) {
    res.status(422).json(err)
  }
})

//detail
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const todo = await Todo.findByPk(id, { raw: true })
    res.render('detail', { todo })
  } catch (err) {
    res.status(422).json(err)
  }
})

// delete
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const todo = await Todo.findByPk(id)
    await todo.destroy()
    req.flash('success_msg', '成功刪除資料')
    res.redirect('/')
  } catch (err) {
    res.status(422).json(err)
  }
})

module.exports = router