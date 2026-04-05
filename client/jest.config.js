module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^components/(.*)$": "<rootDir>/src/components/$1",
    "^hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "^services/(.*)$": "<rootDir>/src/services/$1",
    "^theme/(.*)$": "<rootDir>/src/theme/$1",
    "^redux/(.*)$": "<rootDir>/src/redux/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.js",
    "!src/reportWebVitals.js",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios|@chakra-ui|@emotion|framer-motion)/)",
  ],
  verbose: true,
};
