module.exports = {
  extends: [
    '@hellomouse/eslint-config-typescript'
  ],
  env: {
    node: true,
    es6: true
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
