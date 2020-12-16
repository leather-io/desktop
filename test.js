/* eslint-disable @typescript-eslint/no-var-requires */
const deepMerge = require('deepmerge');

const network = process.env.STX_NETWORK;

console.log('----------------------------------------------------');
console.log(network);
console.log('----------------------------------------------------');

if (!network) throw new Error('Must define STX_NETWORK environment var');

if (!['mainnet', 'testnet'].includes(network))
  throw new Error(`Unknown STX_NETWORK type of: ${String(network)}`);

const baseConfig = {
  artifactName: 'stacks-wallet.${ext}',
  files: ['dist/', 'node_modules/', 'app.html', 'main.prod.js', 'main.prod.js.map', 'package.json'],
  dmg: {
    contents: [
      {
        x: 130,
        y: 220,
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications',
      },
    ],
  },
  win: {
    target: ['nsis', 'msi'],
  },
  mac: {
    hardenedRuntime: false,
    icon: './resources/icon.icns',
    category: 'public.app-category.finance',
  },
  linux: {
    target: ['deb', 'rpm', 'AppImage'],
    icon: 'icon-512x512.png',
    category: 'Development',
  },
  directories: {
    buildResources: 'resources',
    output: 'release',
  },
  publish: {
    provider: 'github',
    owner: 'blockstack',
    repo: 'blockstack',
    private: false,
  },
  protocols: {
    name: 'stacks-wallet',
    schemes: ['stacks-wallet'],
  },
};

const networkConfigs = {
  testnet: {
    productName: 'Stacks Wallet Testnet',
    appId: 'org.stacks.wallet-testnet',
    icon: './resources/icon-512x512-testnet.png',
    artifactName: 'stacks-wallet.${ext}',
    linux: {
      icon: 'icon-512x512-testnet.png',
    },
  },
  mainnet: {
    productName: 'Stacks Wallet',
    appId: 'org.stacks.wallet',
    icon: './resources/icon-512x512.png',
    artifactName: 'stacks-wallet.${ext}',
    linux: {
      icon: 'icon-512x512.png',
    },
  },
};

const mergedConfig = deepMerge(baseConfig, networkConfigs[network]);

console.log(JSON.stringify(mergedConfig, null, 2));

module.exports = mergedConfig;
