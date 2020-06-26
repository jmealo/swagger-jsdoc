module.exports = {
  root: true,
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'func-names': 'off',
    'no-console': 'off',
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
  },
};
