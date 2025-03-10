module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/migrations/**',
    '!**/index.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    '<rootDir>/migrations/',
  ],
};
