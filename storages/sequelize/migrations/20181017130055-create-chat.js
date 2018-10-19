'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
      },
      image: {
        type: Sequelize.STRING(150),
      },
      members_count: {
        type: Sequelize.INTEGER,
        defaultValue: 2,
        allowNull: false,
      },
      type: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0, // 0 - common chat, 1 - group chat
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Chats');
  }
};