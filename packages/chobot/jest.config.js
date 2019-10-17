module.exports = {
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  testRegex: '\\.test\\.ts$',
  moduleNameMapper: {
    '^chobot$': '<rootDir>/src',
    '^chobot/(.*)': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
}
