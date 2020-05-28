module.exports = {
  extends: ['@blockstack/eslint-config', 'plugin:react-hooks/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    ecmaVersion: 2019,
    sourceType: 'module',
    createDefaultProgram: true,
  },
};
