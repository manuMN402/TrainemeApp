const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Optimize performance
config.transformer.minifierConfig = {
  compress: true,
  mangle: true,
  output: {
    comments: false,
  },
};

// Disable expensive operations in development
config.projectRoot = __dirname;

module.exports = config;
