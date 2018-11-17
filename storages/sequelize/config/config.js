module.exports = {
  development: {
    username: 'chat_room_user',
    password: 'i6FicSVd',
    database: 'chat_room',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: {
      underscored: true
    }
  },
  test: {
    username: 'chat_room_test_user',
    password: 'Tm4pUkfze',
    database: process.env.CI_DB_NAME || 'chat_room_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: {
      underscored: true
    }
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres'
  }
};