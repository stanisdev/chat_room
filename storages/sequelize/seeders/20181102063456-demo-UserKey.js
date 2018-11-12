module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserKeys', [{
      id: 1,
      user_id: 3,
      key: 'nXGZ0MlSniHiaM9p1Re7LZb0x',
      expired: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserKeys', null, {});
  }
};
