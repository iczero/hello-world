module.exports = {
  extends: [
    '@hellomouse/eslint-config-typescript'
  ],
  env: {
    es6: true,
    browser: true,
    node: true
  },
  rules: {
    // js compatibility
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/naming-convention': 'off'
  },
  parserOptions: {
    project: './tsconfig.json'
  }
};
