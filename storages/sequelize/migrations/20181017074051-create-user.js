module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.CHAR(60),
        allowNull: false,
      },
      salt: {
        type: Sequelize.CHAR(8),
        allowNull: false,
      },
      personal_key: {
        type: Sequelize.CHAR(7),
        allowNull: false,
      },
      status: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0, // 0 - not activated, 1 - activated
      },
      blocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      last_login: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  },
};
