module.exports = {
  rules: {
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: false,
          ClassDeclaration: false,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
      },
    ],
    'max-len': [1, 90],
    'new-cap': [
      'error',
      {
        newIsCap: false,
        properties: false,
      },
    ],
  },
  extends: 'google',
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    es6: true,
  },
};
