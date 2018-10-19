module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: 1,
      name: 'Mary',
      email: 'mary@gmail.com',
      password: 'xxxx',
      salt: 'mi3IQqKJ',
      personal_key: 'arl8MCn',
      status: 1,
      blocked: false,
      last_login: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      id: 2,
      name: 'Bill',
      email: 'bill@gmail.com',
      password: 'xxxx',
      salt: 'zSNWpDtf',
      personal_key: 'dC0vUb6',
      status: 1,
      blocked: false,
      last_login: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Users', null, {});
  }
};
