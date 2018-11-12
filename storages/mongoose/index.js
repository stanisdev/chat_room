const mongoose = require('mongoose');
const path = require('path');
const modelsPath = path.join(__dirname, 'models');
const configPath = path.join(__dirname, 'config/config.json');
const env = process.env.NODE_ENV || 'development';
const mConfig = require(configPath)[env.toUpperCase()];
const glob = require('glob');

const mongooseConnection = {
  /**
   * Check connection
   */
  async connect() {
    let connectionString = 'mongodb://';
    if (mConfig.IS_LOCAL) {
      connectionString += mConfig.HOST + '/' + mConfig.DB;
    } else {
      connectionString += `${mConfig.USER}:${mConfig.PASSWORD}@${
        mConfig.HOST
      }:${mConfig.PORT}/${mConfig.DB}`;
    }
    await mongoose.connect(
      connectionString,
      { useNewUrlParser: true }
    );

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Mongoose connection error:'));

    const models = glob.sync(modelsPath + '/*.js');
    models.forEach(model => {
      require(model);
    });
    mongoose.set('debug', true);
    return true;
  },
  /**
   * Run seeders
   */
  async seed() {
    await this.connect();
    const db = require('mongoose');
    const seedersPath = path.join(__dirname, 'seeders');
    const seeders = glob.sync(seedersPath + '/*.js');

    for (let a = 0; a < seeders.length; a++) {
      const seeder = seeders[a];
      const seederData = require(seeder);
      const { model, documents } = seederData;

      const seedModel = db.model(model);
      for (let b = 0; b < documents.length; b++) {
        const instance = new seedModel(documents[b]);
        await instance.save();
      }
    }
  },
};

if (typeof process.env.SEED === 'string' && process.env.SEED.length > 0) {
  mongooseConnection
    .seed()
    .then(() => {
      console.log('Successful');
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = mongooseConnection;
