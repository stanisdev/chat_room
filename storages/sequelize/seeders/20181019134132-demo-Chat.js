module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Chats', [{
      id: 1,
      members_count: 2,
      type: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Chats', null, {});
  },
};
