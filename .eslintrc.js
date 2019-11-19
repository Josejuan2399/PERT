module.exports = {
  extends: ['airbnb/base', 'prettier', 'prettier/react'],
  plugins: ['prettier'],
  rules: {
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 0,
    'no-underscore-dangle': 0,
    'import/imports-first': ['error', 'absolute-first'],
    'import/newline-after-import': 'error',
    // best practices
    'no-param-reassign': 0,
    'prefer-template': 2,
    'default-case': 2,
    'guard-for-in': 2,
    'no-alert': 1,
    'no-floating-decimal': 1,
    'no-self-compare': 2,
    'no-throw-literal': 2,
    'no-void': 2,
    'quote-props': [2, 'as-needed'],
    'vars-on-top': 2,
    'wrap-iife': 2,
    // variables
    'no-unused-vars': 0,
    'import/prefer-default-export': 0,
    'no-undef' : 2,
    'no-var': 2,
    'no-const-assign': 2,
    'prefer-const': 2,
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    'comma-style': [2, 'last'],
    'comma-dangle': [2, 'never'],
    'eol-last': [2, 'always'],
    'max-nested-callbacks': [2, 5],
    'newline-after-var': [2, 'always'],
    'no-nested-ternary': 2,
    'no-spaced-func': 0,
    'no-trailing-spaces': 2,
    'no-underscore-dangle': 0,
    'no-unneeded-ternary': 1,
    'one-var': ["error", "always"],
    'no-prototype-builtins': 0,
    'global-require': 0,
    'no-use-before-define': 0,
    'no-restricted-syntax': 0,
    radix: 0,
    quotes: [2, 'single', 'avoid-escape'],
    semi: [2, 'always'],
    'keyword-spacing': 2,
    'space-before-blocks': [2, 'always'],
    'space-infix-ops': [
      1,
      {
        int32Hint: false
      }
    ],
    'spaced-comment': [2, 'always'],
    // es6
    'generator-star-spacing': [2, 'before'],
    // legacy jshint rules
    'max-depth': [2, 4],
    'max-params': [2, 4]
  },
  parser: 'babel-eslint'
}
