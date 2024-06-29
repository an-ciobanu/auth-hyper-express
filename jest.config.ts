import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  preset: "ts-jest",
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
		tsconfig: "tsconfig.json",
	  },]
  },
  testMatch: ["<rootDir>/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "src/**/*.ts", // Adjust this pattern to match your source files
    "!src/**/*.test.ts", // Exclude test files from coverage
	"!src/constants/**/*",
	"!src/user/user.model.ts"
  ],
};

export default config;
