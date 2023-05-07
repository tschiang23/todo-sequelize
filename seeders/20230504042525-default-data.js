'use strict'
const bcrypt = require('bcryptjs')
const SEED_USER = [{
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678',
}, {
  name: 'user2',
  email: 'user2@example.com',
  password: '12345678',
}]
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // 建立user資料
      await queryInterface.bulkInsert('Users', SEED_USER.map((user => ({
        name: user.name,
        email: user.email,
        password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null),
        createdAt: new Date(),
        updatedAt: new Date()
      }))), {})

      // 查詢users資料表
      const users = await queryInterface.sequelize.query(
        "SELECT * FROM Users", {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })

      // 製作userTodos
      const userTodos = Array.from({ length: 10 }).map((_, i) =>
      ({
        name: `name-${i}`,
        UserId: i < 5 ? users[0].id : users[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      )


      await queryInterface.bulkInsert('Todos', userTodos, {})
    }
    catch (err) {
      console.log(err)
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Todos', null, {})
      await queryInterface.bulkDelete('Users', null, {})
    } catch (err) {
      console.log(err)
    }

  }
}

