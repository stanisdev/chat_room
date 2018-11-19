module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'UserKeys',
      [
        {
          id: 10,
          user_id: 12,
          key: 'nXGZ0MlSniHiaM9p1Re7LZb0x',
          expired: new Date(),
        },
        {
          id: 11,
          user_id: 13,
          key: 'SeOI32WmzFRHMAhdBHRgJaE1n',
          expired: new Date(new Date().getTime() - 1000), // Expired
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserKeys', null, {});
  },
};
