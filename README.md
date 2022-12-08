# Hiro Wallet—Desktop

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/blockstack/stacks-wallet/Build)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/blockstack/stacks-wallet)](https://github.com/blockstack/stacks-wallet/releases/latest)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![coverage](https://raw.githubusercontent.com/blockstack/stacks-wallet/gh-pages/badge.svg)](https://blockstack.github.io/stacks-wallet/)

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/blockstack/stacks-wallet)

![Hiro Wallet Hero](/resources/readme.png)

Implementation of the Stacks 2.0 wallet for Desktop

## Getting started

1. Ensure you have [Yarn](https://yarnpkg.com/) installed.
1. After [cloning the repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository), run `yarn` in the root of the project to install the dependencies.
1. Run `yarn dev:testnet` to start a development server.

### Ubuntu

Ensure you're using a recent version of Node v14 and yarn 1. This project requires these versions for development.

If you're using `nvm`, you can install and use Node v14 with,

```bash
nvm install 14
nvm use 14
```

When using Node v14, `yarn` needs to be installed separately. [Follow yarn's installation instructions](https://classic.yarnpkg.com/en/docs/install#debian-stable).

With Node v14 and yarn installed, run `yarn dev:testnet` to start developing.
