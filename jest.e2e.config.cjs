const jestConfig = {
  clearMocks: true,
  testEnvironment: "node",
  coverageProvider: "v8",
  testMatch: ["<rootDir>/tests/e2e/**/*.test.js"],
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
