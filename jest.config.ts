import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  modulePaths: ['<rootDir>/src'],
  setupFiles: ['dotenv/config']
};

export default config;