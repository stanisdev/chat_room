module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ChatMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      chat_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Chats',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      role: {
        type: Sequelize.TINYINT,
        defaultValue: 0, // 0 - common member, 1 - administrator
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ChatMembers');
  }
};