const glob = require('glob');
const path = require('path');
const config = require(process.env.CONFIG_PATH);
const { SERVICES_PATH, CODES_PATH, MAILER } = config;
const codes = require(CODES_PATH);
const db = require(config.STORAGES_PATH);
const { routes, wrapper, errors, other, logger, jwt } = require(SERVICES_PATH);
const mailer = require(MAILER.PATH);
const _validators = require(config.VALIDATORS_PATH);
const _ = require('lodash');
const status = require('http-status');
const context = {
  services: {
    ...other,
    mailer,
    jwt,
  },
  codes,
  config,
  log: logger,
  fail: res => {
    res.status(status.BAD_REQUEST).json({});
  },
};

const builder = {
  async init(app) {
    const controllers = glob.sync(config.CONTROLLERS_PATH + '/*.js');
    await db.authenticate();
    logger(__filename).info(
      'Database connection has been established successfully'
    );
    context.db = db.getConnection();
    const _filters = require(config.FILTERS_PATH);

    controllers.forEach(controller => {
      const controllerName = path.basename(controller).slice(0, -3);
      if (!routes.hasOwnProperty(controllerName)) {
        throw new Error(`Controller ${controllerName} does not exist`);
      }
      const ControllerClass = require(controller);
      const controllerInstance = new ControllerClass();
      const { handlers, namespace } = routes[controllerName];

      _.forEach(handlers, (handler, controllerMethodName) => {
        const controllerMethod = controllerInstance[controllerMethodName];
        if (!(controllerMethod instanceof Function)) {
          throw new Error(
            `Controller ${controllerName} does not contain ` +
              `required method ${controllerMethodName}`
          );
        }

        const { route, noAuth, validators, filters } = handler;
        let [url, httpMethod] = route;

        if (typeof namespace === 'string' && namespace.length > 1) {
          url = namespace + url;
        }
        const args = [url];
        if (!noAuth) {
          args.push(wrapper(_filters.auth));
        }
        if (Array.isArray(validators)) {
          // Validators
          validators.forEach(validator => {
            const [className, validatorName] = validator.split('.');
            const classValidator = _validators[className];
            if (!(classValidator instanceof Object)) {
              throw new Error(
                `Validator's class with name "${className}" ` +
                  `does not exists`
              );
            }
            const _validator = classValidator[validatorName];
            if (!(_validator instanceof Function)) {
              throw new Error(
                `The validator "${validator}" is expected as a function`
              );
            }
            args.push(wrapper(_validator.bind(context)));
          });
        }
        if (Array.isArray(filters)) {
          // Filters
          filters.forEach(filter => {
            const [className, filterName] = filter.split('.');
            const classFilter = _filters[className];
            if (!(classFilter instanceof Object)) {
              throw new Error(
                `Filter's class with name ${className} does not exist`
              );
            }
            const _filter = classFilter[filterName];
            if (!(_filter instanceof Function)) {
              throw new Error(
                `The filter "${filter}" is expected as a function`
              );
            }
            args.push(wrapper(_filter.bind(context)));
          });
        }
        args.push(wrapper(controllerMethod.bind(context)));
        app[httpMethod.toLowerCase()](...args);
      });
    });

    errors(app);
  },
};

module.exports = builder;
