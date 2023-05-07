'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    //在 Todos 這個資料表裡新增一個名為 UserId 的欄位
    return queryInterface.addColumn('Todos', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { //外鍵:跟 Users 資料表裡的 id 欄位的關聯。
        model: 'Users', //資料表開頭大寫
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    //從 Todos 資料表刪除 UserId 這個欄位。
    return queryInterface.removeColumn('Todos', 'UserId')
  }
};
