import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: ['services/slices/**/*.{js,jsx,ts,tsx}'],
  coverageDirectory: '../coverage',
  preset: 'ts-jest',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '@api': '<rootDir>/utils/burger-api.ts',
    '@slices': '<rootDir>/services/slices',
    '@utils-cookies': '<rootDir>/utils/cookie'
  },
  rootDir: './src',
  roots: [
    '<rootDir>',
    '<rootDir>/services/slices/tests/slicesTests',
    '<rootDir>/services/slices/tests/storeTest'
  ],
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  verbose: true
};

export default config;
