module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 10,
          name: 'Mary',
          email: 'mary@gmail.com',
          password:
            '$2b$10$BqsBFzGky7rE1FCCy2vRRe3hEdBBgOWqKwSMx2oFz9IzRxZ6U5tOi', // nice_password
          salt: '4tFvVntS',
          personal_key: 'arl8MCn',
          status: 1,
          blocked: false,
          last_login: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 11,
          name: 'Bill',
          email: 'bill@gmail.com',
          password:
            '$2b$10$BqsBFzGky7rE1FCCy2vRRe3hEdBBgOWqKwSMx2oFz9IzRxZ6U5tOi', // nice_password
          salt: '4tFvVntS',
          personal_key: 'dC0vUb6',
          status: 1,
          blocked: false,
          last_login: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 12,
          name: 'Robert',
          email: 'robert@gmail.com',
          password:
            '$2b$10$BqsBFzGky7rE1FCCy2vRRe3hEdBBgOWqKwSMx2oFz9IzRxZ6U5tOi', // nice_password
          salt: '4tFvVntS',
          personal_key: 'xdZsb4S',
          status: 0, // Not confirmed email
          blocked: false,
          last_login: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 13,
          name: 'Mark',
          email: 'mark@gmail.com',
          password:
            '$2b$10$BqsBFzGky7rE1FCCy2vRRe3hEdBBgOWqKwSMx2oFz9IzRxZ6U5tOi', // nice_password
          salt: '4tFvVntS',
          personal_key: 'rf2PVkp',
          status: 0, // Not confirmed email (and confirmed key expired)
          blocked: false,
          last_login: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
