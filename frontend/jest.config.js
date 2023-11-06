import { pathsToModuleNameMapper } from 'ts-jest'
import tsConfig from "./tsconfig.json" assert { type: 'json' }

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  clearMocks: true,
  roots: ['<rootDir>'],
  modulePaths: [tsConfig.compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/file.mock.js",
      "\\.(css|less|scss)$": "identity-obj-proxy",
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths)},
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts']
};