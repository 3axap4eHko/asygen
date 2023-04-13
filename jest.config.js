export default {
  verbose: true,
  collectCoverage: !!process.env.CI,
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coveragePathIgnorePatterns: ['/coverage', '/node_modules/', '__tests__'],
  coverageDirectory: './coverage',
  transform: {
    '^.+\\.ts$': ['@swc/jest', {}],
  },
  testMatch: ['**/__tests__/**/*.ts'],
};
