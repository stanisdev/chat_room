module.exports = {
  model: 'User',
  documents: [
    {
      name: 'Mary',
      email: 'mary@gmail.com',
      password: '$2b$10$BqsBFzGky7rE1FCCy2vRRe3hEdBBgOWqKwSMx2oFz9IzRxZ6U5tOi', // nice_password
      salt: '4tFvVntS',
      personal_key: 'arl8MCn',
      status: 1,
      blocked: false,
      last_login: new Date(),
    },
    {
      name: 'Bill',
      email: 'bill@gmail.com',
      password: '$2b$10$BqsBFzGky7rE1FCCy2vRRe3hEdBBgOWqKwSMx2oFz9IzRxZ6U5tOi', // nice_password
      salt: '4tFvVntS',
      personal_key: 'dC0vUb6',
      status: 1,
      blocked: false,
      last_login: new Date(),
    },
  ],
};
