/* eslint-disable @typescript-eslint/no-var-requires */
const deepMerge = require('deepmerge');

const network = process.env.STX_NETWORK || 'testnet';

if (!network) throw new Error('Must define STX_NETWORK environment variable');

if (!['mainnet', 'testnet'].includes(process.env.STX_NETWORK)) {
  console.warn('You have no set a `STX_NETWORK` env var, defaulting to testnet');
}

const baseConfig = {
  files: [
    'dist/',
    'node_modules/',
    'app.html',
    'main.prod.js',
    'main.prod.js.map',
    'preload.js',
    'package.json',
  ],
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
    category: 'public.app-category.finance',
  },
  linux: {
    target: ['deb', 'rpm', 'AppImage'],
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
  // protocols: {
  //   name: 'stacks-wallet',
  //   schemes: ['stacks-wallet'],
  // },
};

const networkConfigs = {
  testnet: {
    productName: 'Stacks Wallet Testnet',
    appId: 'so.hiro.StacksWalletTestnet',
    artifactName: 'stacks-wallet.testnet.${ext}',
    mac: {
      icon: 'icon.testnet.icns',
      appId: 'so.hiro.StacksWalletTestnet',
    },
    linux: {
      icon: './icons',
    },
    // macos `Application Support` dir name
    extraMetadata: {
      productName: 'StacksWalletTestnet',
    },
  },
  mainnet: {
    productName: 'Stacks Wallet',
    appId: 'so.hiro.StacksWallet',
    icon: 'icon-512x512.png',
    artifactName: 'stacks-wallet.${ext}',
    mac: {
      icon: 'icon.icns',
      appId: 'so.hiro.StacksWallet',
    },
    linux: {
      icon: 'icon-512x512.png',
    },
    extraMetadata: {
      productName: 'StacksWallet',
    },
  },
};

const mergedConfig = deepMerge(baseConfig, networkConfigs[network]);

console.log(JSON.stringify(mergedConfig, null, 2));

module.exports = mergedConfig;
