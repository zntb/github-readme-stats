export default {
  clearMocks: true,
  testEnvironment: "jsdom",
  coverageProvider: "v8",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  modulePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/", "<rootDir>/app/"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "themes/**/*.js",
    "!src/index.js",
    "!src/cards/index.js",
    "!src/common/index.js",
  ],
  moduleNameMapper: {
    // Allow @/ imports in tests (matches tsconfig paths)
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Transform all JS files with babel
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  // Don't transform node_modules
  transformIgnorePatterns: ["/node_modules/"],
};
