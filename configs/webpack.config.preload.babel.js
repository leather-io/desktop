/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/**
 * Webpack config for production electron main process
 */
import { CheckNodeEnv } from '../internals/scripts/CheckNodeEnv';
import DeleteSourceMaps from '../internals/scripts/DeleteSourceMaps';
import baseConfig from './webpack.config.base';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

// eslint-disable-next-line import/no-default-export
export default merge(baseConfig, {
  mode: process.env.NODE_ENV,

  externals: ['@ledgerhq/hw-transport-node-hid', 'argon2-browser'],

  target: 'electron-preload',

  entry: './app/preload.ts',

  output: {
    path: path.join(__dirname, '..'),
    filename: './app/preload.js',
    libraryTarget: 'commonjs2',
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
      E2E_BUILD: false,
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
});
