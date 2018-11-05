const mongoose = require('mongoose');
const config = require(process.env.CONFIG_PATH);
const path = require('path');
const modelsPath = path.join(config.MONGOOSE_PATH, 'models');
const configPath = path.join(config.MONGOOSE_PATH, 'config/config.json');
const env = process.env.NODE_ENV || 'development';
const mConfig = require(configPath)[env.toUpperCase()];
const glob = require('glob');

module.exports = {
  async connect() {
    let connectionString = 'mongodb://';
    if (mConfig.IS_LOCAL) {
      connectionString += mConfig.HOST + '/' + mConfig.DB;
    }
    else {
      connectionString += `${mConfig.USER}:${mConfig.PASSWORD}@${mConfig.HOST}:${mConfig.PORT}/${mConfig.DB}`;
    }
    await mongoose.connect(connectionString, { useNewUrlParser: true });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Mongoose connection error:'));

    const models = glob.sync(modelsPath + '/*.js');
    models.forEach((model) => {
      require(model);
    });
    return true;
  },
};