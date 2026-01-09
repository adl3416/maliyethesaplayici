const { getDefaultConfig, mergeConfig } = require('metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  project: {
    ios: {},
    android: {},
    web: {},
  },
});
