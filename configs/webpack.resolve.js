const path = require("path");

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: [path.join(__dirname, "../app"), "node_modules"],
    alias: {
      "@ledgerhq/hw-app-btc": path.resolve(
        __dirname,
        "../node_modules",
        "ablankstein-ledger-hw-app-btc"
      ),
      "bitcoinjs-lib": path.resolve(
        __dirname,
        "../node_modules",
        "bitcoinjs-lib"
      ),
      "@components": path.resolve(__dirname, "../app", "components"),
      "@containers": path.resolve(__dirname, "../app", "containers"),
      "@screens": path.resolve(__dirname, "../app", "screens"),
      "@common": path.resolve(__dirname, "../app", "common"),
      "@stores": path.resolve(__dirname, "../app", "store"),
      "@actions": path.resolve(__dirname, "../app", "actions"),
      "@reducers": path.resolve(__dirname, "../app", "reducers"),
      "@vendor": path.resolve(__dirname, "../app", "vendor"),
      "@utils": path.resolve(__dirname, "../app", "utils")
    }
  }
};
