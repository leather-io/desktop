# Leather—Desktop

> [!WARNING]  
> As of October 1st 2025 Leather's desktop is discontinued. Wallets should be migrated to either our Web Extension or mobile app. [Read out annoucement →](https://app.leather.io/changelog/deprecation-desktop-wallet)

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
