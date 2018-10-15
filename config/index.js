const path = require('path');
const rootDir = path.dirname(__dirname);

module.exports = {
  ROOT_DIR: rootDir,
  PORT_DEFAULT: 3000,
  APP_FILE: path.join(rootDir, 'app'),
  CONTROLLERS_PATH: path.join(rootDir, 'controllers'),
  SERVICES_PATH: path.join(rootDir, 'services'),
};