const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const config = require(process.env.CONFIG_PATH);
const services = require(config.SERVICES_PATH);
services.build.init(app);

module.exports = app;
services.errors(app);