const jestConfig = {
  clearMocks: true,
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  modulePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  moduleNameMapper: {
    // Allow @/ imports in tests (matches tsconfig paths)
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Transform all JS files with babel
  transform: {
    "^.+\\.js$": [
      "babel-jest",
      {
        presets: [["@babel/preset-env", { targets: { node: "current" } }]],
      },
    ],
  },
  // Don't transform node_modules
  transformIgnorePatterns: ["/node_modules/"],
};

module.exports = jestConfig;
