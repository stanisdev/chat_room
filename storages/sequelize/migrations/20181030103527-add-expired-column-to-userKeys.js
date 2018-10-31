module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('UserKeys', 'expired', {
      type: 'TIMESTAMP',
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('UserKeys', 'expired');
  },
};
