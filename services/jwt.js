const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const keyFilePath = path.join(process.env.CONFIG_PATH, 'jwt_key');
const key = fs.readFileSync(keyFilePath, { encoding: 'utf-8' });
const util = require('util');

module.exports = {
  sign(data) {
    return util.promisify(jwt.sign)(data, key);
  },
  verify(token) {
    return util.promisify(jwt.verify)(token, key);
  },
};
