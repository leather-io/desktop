const defaultConfig = require('@leather-wallet/prettier-config');

module.exports = {
  ...defaultConfig,
  importOrder: [
    ...defaultConfig.importOrder,
    '^@(api|assets|components|constants|crypto|hooks|modals|models|models|store|utils)/(.*)$',
    '^[./]',
  ],
};
