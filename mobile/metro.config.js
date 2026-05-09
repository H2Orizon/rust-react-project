const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const sharedPath = path.resolve(__dirname, "../shared");

config.watchFolders = [sharedPath];

config.resolver.alias = {
  "@": path.resolve(__dirname, "src"),
  "@shared": sharedPath,
};

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../node_modules"),
];

module.exports = config;