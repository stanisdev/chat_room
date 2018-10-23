'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ChatMembers', [{
      id: 1,
      user_id: 1,
      chat_id: 1,
    }, {
      id: 2,
      user_id: 2,
      chat_id: 1,
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ChatMembers', null, {});
  },
};
