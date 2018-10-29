const path = require('path');
const rootDir = path.dirname(__dirname);
const storagesPath = path.join(rootDir, 'storages');
const servicesPath = path.join(rootDir, 'services');

module.exports = {
  ROOT_DIR: rootDir,
  PORT_DEFAULT: 3000,
  APP_FILE: path.join(rootDir, 'app'),
  CONTROLLERS_PATH: path.join(rootDir, 'controllers'),
  SERVICES_PATH: servicesPath,
  STORAGES_PATH: storagesPath,
  SEQUELIZE_PATH: path.join(storagesPath, 'sequelize', 'models'),
  STORAGE_DIRECTIONS: ['sequelize'],
  LOGGER_PATH: path.join(servicesPath, 'logger'),
  FILTERS_PATH: path.join(rootDir, 'filters'),
  VALIDATORS_PATH: path.join(rootDir, 'validators'),
  MESSAGES_PER_PAGE: 15,
  CODES_PATH: path.join(rootDir, 'config', 'codes.json'),
  MAILER: {
    PATH: path.join(servicesPath, 'mailer'),
    TEMPLATES_PATH: path.join(servicesPath, 'mailer', 'templates'),
    FROM: process.env.MAILER_FROM,
    AUTH: {
      USER: process.env.MAILER_USER,
      PASSWORD: process.env.MAILER_PASSWORD,
    },
  },
  APP_NAME: 'Chat Room',
  SERVER_URL: 'http://magic.org',
};
