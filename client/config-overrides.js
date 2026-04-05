const path = require("path");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const browserProcess = require.resolve("process/browser");

module.exports = function override(config, env) {
  config.resolve.fullySpecified = false;

  const moduleScopePlugin = config.resolve.plugins?.find(
    (plugin) => plugin instanceof ModuleScopePlugin,
  );

  if (moduleScopePlugin) {
    moduleScopePlugin.allowedFiles.add(browserProcess);
    moduleScopePlugin.allowedPaths.push(path.dirname(browserProcess));
  }

  config.resolve.alias = {
    ...config.resolve.alias,
    process: browserProcess,
    "process/browser": browserProcess,
    "process/browser.js": browserProcess,
  };

  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: browserProcess,
    stream: require.resolve("stream-browserify"),
    zlib: require.resolve("browserify-zlib"),
    util: require.resolve("util"),
    buffer: require.resolve("buffer"),
    crypto: require.resolve("crypto-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    path: require.resolve("path-browserify"),
    fs: false,
    net: false,
    tls: false,
  };

  const { ProvidePlugin } = require("webpack");
  config.plugins.push(
    new ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: browserProcess,
    })
  );

  // Suppress source-map-loader warnings from node_modules
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /Module Warning.*source-map-loader/,
  ];

  return config;
};
