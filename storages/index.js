const config = require(process.env.CONFIG_PATH);
const storageDirection = process.env.STORAGE_DIRECTION;
const storagePath = config[storageDirection.toUpperCase() + '_PATH'];
let db;

module.exports = {
  async authenticate() {
    if (
      !config.STORAGE_DIRECTIONS.some(
        direction => direction === storageDirection
      )
    ) {
      throw new Error('The storage is not correct or was not specified');
    }
    switch (storageDirection) {
      case 'sequelize':
        db = require(storagePath);
        await db.sequelize.authenticate();
        break;
      case 'mongoose':
        mongoose = require(storagePath);
        await mongoose.connect();

        db = new Proxy(
          {
            db: require('mongoose'),
          },
          {
            get: function(target, propName) {
              return target.db.model(propName);
            },
          }
        );
        break;
    }
    return true;
  },
  getConnection() {
    return db;
  },
};
