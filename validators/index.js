const path = require('path');
const glob = require('glob');

const pathes = glob.sync(path.join(__dirname, '/*.js'))
    .filter((m) => !m.endsWith('index.js'));

module.exports = pathes.reduce((validators, _path) => {
  const validator = require(_path);
  const validatorName = path.basename(_path, '.js');
  return {
    [validatorName]: validator,
    ...validators,
  };
}, {});
