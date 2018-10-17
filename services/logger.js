const logger = require('color-logs')

module.exports = (fileName) => {
  return logger(true, true, fileName);
};