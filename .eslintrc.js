// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    ecmaFeatures: { 
      jsx: true,
      experimentalObjectRestSpread: true
    },
    sourceType: "module",
    useJSXTextNode: true,
    project: "./tsconfig.json"
  },
  env: {
    'browser': true,
    'node': true,
    'commonjs': true,
    'es6': true,
    "jest": true
  },
  extends: [
    // "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    // "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/babel",
    "prettier/flowtype",
    "prettier/unicorn"
  ],
  plugins: [
    "@typescript-eslint",
    "prettier"
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "linebreak-style": ["off", "unix"],
    "prettier/prettier": "error",
    '@typescript-eslint/no-var-requires': 0,
    "no-new": 0
  }
}