module.exports = {
  root: true,
  extends: ['@stacks/eslint-config', 'plugin:react-hooks/recommended'],
  plugins: ['react'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    ecmaVersion: 2019,
    sourceType: 'module',
    createDefaultProgram: true,
  },
  rules: {
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/unbound-method': 0,
    'no-warning-comments': ['warn', { terms: ['SECURITY'], location: 'anywhere' }],

    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'import/no-unresolved': 0,
    'import/no-mutable-exports': ['error'],
    'import/no-useless-path-segments': ['error'],
    'import/first': ['error'],
    'import/no-duplicates': ['error'],
    'import/no-default-export': ['error'],
  },
};
