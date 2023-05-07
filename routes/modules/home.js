const router = require('express').Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/', async (req, res) => {
  try {
    // 查詢多筆資料：findAll()
    const results = await Todo.findAll({
      where: { UserId: req.user.id },
      order: [
        ['id', 'DESC'],
        // ['name', 'ASC'],
      ],
      attributes: ['id', 'name'],
      //{ raw: true, nest: true}把資料轉換成單純 JS 物件
      raw: true,
      nest: true
    })
    res.render('index', { todos: results })
  } catch (err) {
    res.status(422).json(err)
  }
})

module.exports = router