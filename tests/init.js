const path = require('path');
const rootDir = path.dirname(__dirname);
const config = require(path.join(rootDir, 'config'));
const sequelizeDir = path.dirname(config.SEQUELIZE_PATH);
const sequelizeConfigPath = path.join(sequelizeDir, 'config', 'config.js');
const sequelizeConfig = require(sequelizeConfigPath);
const credentials = sequelizeConfig.test;
const migrationPath = path.join(sequelizeDir, 'migrations');
const testDatabaseName = 'super_tests';

const { Client } = require('pg');
credentials.user = credentials.username;

const client = new Client(credentials);
(async () => {
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS ${testDatabaseName}`);
  await client.query(`CREATE DATABASE ${testDatabaseName}`);

  const Sequelize = require('sequelize');
  const Umzug = require('umzug');
  const sequelize = new Sequelize(
    testDatabaseName,
    credentials.username,
    credentials.password,
    credentials
  );
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize: sequelize,
    },
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
      path: migrationPath,
    },
  });
  await umzug.up();

  console.log('The test database has been created and migrations executed');
  process.exit();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
