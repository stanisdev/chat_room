module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserKeys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      key: { //@TODO: Should be set as unique
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserKeys');
  },
};
