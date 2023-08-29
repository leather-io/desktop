# Leather—Desktop

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/hirosystems/wallet-desktop/Build)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/hirosystems/wallet-desktop)](https://github.com/hirosystems/wallet-desktop/releases/latest)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![coverage](https://raw.githubusercontent.com/hirosystems/wallet-desktop/gh-pages/badge.svg)](https://blockstack.github.io/stacks-wallet/)

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/hirosystems/wallet-desktop)

Implementation of the Stacks 2.0 wallet for Desktop

## Getting started

Ensure you have a recent version of Node.js 16 and Yarn 1 installed. Note that recent versions of Node.js 16 come with [Corepack](https://nodejs.org/api/corepack.html#corepack), which allows using Yarn without any additional installation once enabled,

```bash
corepack enable yarn
```

On a Linux machine, you may need a few dependencies before installing packages or building the app. On Debian/Ubuntu, they can be installed with

```bash
sudo apt install pkg-config libusb-1.0-0-dev libudev-dev
```

After [cloning the repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository), run `yarn` in the root of the project to install the dependencies.

Finally, run `yarn dev:testnet` to start a development server.

## Environment variables

The environment variables used are listed in [webpack.config.base.js](./configs/webpack.config.base.js).

During development, their value can be set by defining them before running the app,

```bash
export MY_VAR=value
yarn dev:testnet
```

For pipelines that build the app, the environment variables are defined in the pipeline definition file.
