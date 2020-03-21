# Stacks Wallet

The Stacks Wallet enables holders of Stacks to send and receive tokens. [Read the announcement here.](https://blog.blockstack.org/introducing-the-stacks-wallet/)

![The Stacks Wallet](https://file-elonievacp.now.sh/)

## Releases
Get the latest release here: https://github.com/blockstack/stacks-wallet/releases

## Running the Wallet Locally

```bash
$ npm install

# or

$ yarn
```

```bash
$ npm run dev

# or

$ yarn dev
```

## Building from Source
To build your own version of the wallet, you can clone this repository and then run the following commands:

```bash
$ npm install
$ npm run package-all

# or

$ yarn
$ yarn package-all
```

This will build both MacOS and Windows versions.

## Building from Source - Linux

Depending on your distribution, there are a few options and possible prerequisites. The instructions below were generated using Linux Mint 19 (an Ubuntu/Debian variant), so if you run into a problem please submit an issue.

### Prerequisites

`node`, `npm`, and `yarn` should be installed.

`electron-builder` should be installed via `yarn`.

The package `libudev-dev` is required on Ubuntu/Debian installations.

__Note: Use `yarn` instead of `npm` during the build process.__

### Command Reference

| Command | Result |
| ------- | ------ |
| `yarn package-linux-deb`      | Build .deb file  |
| `yarn package-linux-rpm`      | Build .rpm file |
| `yarn package-linux-snap`     | Build snap installer |
| `yarn package-linux-appimage` | Build appimage installer |

### The Installation

Clone and download this repo

Run the following commands:

```bash
yarn
yarn package-linux-deb
```

Please be sure to select the correct package type for your OS.
