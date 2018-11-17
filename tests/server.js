const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const path = require('path');
const rootDir = path.dirname(__dirname);
const configPath = path.join(rootDir, 'config');
const appFilePath = path.join(rootDir, 'app.js');
const config = require(configPath);

process.env.CONFIG_PATH = configPath;
process.env.LOGGER_PATH = config.LOGGER_PATH;
process.env.STORAGE_DIRECTION = 'sequelize';

const storage = require(config.STORAGES_PATH);
const server = require(appFilePath);
chai.use(require('chai-as-promised'));
chai.use(chaiHttp);

module.exports = { chai, server, expect, storage };
