// craco.config.js
const path = require("path");
require("dotenv").config();

module.exports = {
  // Mirror the webpack "@" alias for CRA's Jest runner.
  jest: {
    configure: (jestConfig) => {
      jestConfig.moduleNameMapper = {
        "^@/(.*)$": "<rootDir>/src/$1",
        // react-router v7's "main" points to a non-existent file and Jest 27
        // can't read its "exports" map — resolve the CJS builds directly.
        "^react-router-dom$": "<rootDir>/node_modules/react-router-dom/dist/index.js",
        "^react-router$": "<rootDir>/node_modules/react-router/dist/development/index.js",
        "^react-router/dom$": "<rootDir>/node_modules/react-router/dist/development/dom-export.js",
        ...jestConfig.moduleNameMapper,
      };
      return jestConfig;
    },
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**",
        ],
      };
      return webpackConfig;
    },
  },
};
