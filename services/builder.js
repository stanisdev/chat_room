const glob = require('glob');
const path = require('path');
const config = require(process.env.CONFIG_PATH);
const {SERVICES_PATH} = config;
const {routes, wrapper, errors} = require(SERVICES_PATH);
const {auth} = require(config.FILTERS_PATH);
const _validators = require(config.VALIDATORS_PATH);
const _ = require('lodash');
const context = {
  storage: null,
};

const builder = {
  init(app) {
    const controllers = glob.sync(config.CONTROLLERS_PATH + '/*.js');

    controllers.forEach((controller) => {

      const controllerName = path.basename(controller).slice(0, -3);
      if (!routes.hasOwnProperty(controllerName)) {
        throw new Error(`Controller ${controllerName} does not exist`);
      }
      const controllerClass = require(controller);
      const controllerInstance = new controllerClass();
      const {handlers, namespace} = routes[controllerName];

      _.forEach(handlers, (handler, controllerMethodName) => {
        const controllerMethod = controllerInstance[controllerMethodName];
        if (!(controllerMethod instanceof Function)) {
          throw new Error(`Controller ${controllerName} does not contain required method ${controllerMethodName}`);
        }

        const {route, noAuth, validators} = handler;
        let [url, httpMethod] = route;

        if (typeof namespace === 'string' && namespace.length > 1) {
          url = namespace + url;
        }
        const args = [url];
        if (!noAuth) {
          args.push(auth);
        }
        if (Array.isArray(validators) && validators.length > 0) {
          validators.forEach((validator) => {
            const [className, methodName] = validator.split('.');
            const classValidator = _validators[className];
            if (!(classValidator instanceof Object)) {
              throw new Error(`Validator's class with name "${className}" does not exists`);
            }
            args.push(classValidator[methodName])
          });
        }
        args.push(
          wrapper(controllerMethod.bind(context))
        );
        app[httpMethod.toLowerCase()].apply(app, args);
      });
      
    });

    errors(app);
  }
};

module.exports = builder;