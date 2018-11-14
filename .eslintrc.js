module.exports = {
  rules: {
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: true,
          FunctionExpression: true,
        },
      },
    ],
    'max-len': [1, 100],
    'new-cap': [
      'error',
      {
        newIsCap: false,
        properties: false,
      },
    ],
    indent: 0,
    'object-curly-spacing': [2, 'always'],
    'arrow-parens': ['error', 'as-needed'],
  },
  extends: 'google',
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    es6: true,
  },
};
