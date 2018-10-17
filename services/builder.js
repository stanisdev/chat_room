const glob = require('glob');
const path = require('path');
const config = require(process.env.CONFIG_PATH);
const {SERVICES_PATH} = config;
const {routes, wrapper, errors} = require(SERVICES_PATH);
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

        const {route} = handler;
        let [url, httpMethod] = route;

        if (typeof namespace === 'string' && namespace.length > 1) {
          url = namespace + url;
        }
        app[httpMethod.toLowerCase()](url, wrapper(controllerMethod.bind(context)));
      });
      
    });

    errors(app);
  }
};

module.exports = builder;