const defaultConfig = require('@stacks/prettier-config');

module.exports = {
  ...defaultConfig,
  importOrder: [
    '^react',
    '<THIRD_PARTY_MODULES>',
    '^@(api|assets|components|constants|crypto|hooks|modals|models|models|store|utils)/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
