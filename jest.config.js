module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/app/**/*.spec.ts'],
  verbose: true,
  collectCoverageFrom: [
    '<rootDir>/app/**/*.ts',
    '<rootDir>/app/**/*.tsx',
    '!<rootDir>/app/main.dev.ts',
    '!<rootDir>/app/menu.ts',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules', 'app/node_modules'],
  setupFiles: ['./internals/scripts/CheckBuildsExist.js'],
};
