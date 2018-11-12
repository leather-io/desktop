const path = require("path");

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: [path.join(__dirname, "../app"), "node_modules"],
    alias: {
      "@components": path.resolve(__dirname, "../app", "components"),
      "@containers": path.resolve(__dirname, "../app", "containers"),
      "@screens": path.resolve(__dirname, "../app", "screens"),
      "@common": path.resolve(__dirname, "../app", "common"),
      "@stores": path.resolve(__dirname, "../app", "store"),
      "@actions": path.resolve(__dirname, "../app", "actions"),
      "@reducers": path.resolve(__dirname, "../app", "reducers"),
      "@utils": path.resolve(__dirname, "../app", "utils")
    }
  }
};
