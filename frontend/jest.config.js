import { pathsToModuleNameMapper } from 'ts-jest'
import tsConfig from "./tsconfig.json" assert { type: 'json' }

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  clearMocks: true,
  roots: ['<rootDir>'],
  modulePaths: [tsConfig.compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths),
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts']
};