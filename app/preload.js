window.module = module;

window.procNodeEnv = process.env.NODE_ENV
window.procHot = process.env.HOT
window.procPort = process.env.PORT

const moduleWhiteList = [
	'react',
	'react-dom',
	'react-hot-loader',
	'react-redux',
	'react-router-redux',
	'styled-components',
	'blockstack-ui',
	'react-router',
	'react-router-dom',
	'@blockstack/stacks-utils',
	'reakit',
	'styled-system',
	'react-powerplug',
	'polished',
	'immer',
	'shortid',
	'react-spring',
	'redux-persist',
	'blockstack',
	'c32check',
	'@ledgerhq/hw-transport-node-hid',
	'bitcoinjs-lib',
	'bigi',
	'bignumber.js',
	'crypto',
	'ablankstein-ledger-hw-app-btc',
	'rwlock',
	'varuint-bitcoin',
	'connected-react-router',
	'electron-store',
	'bip32',
	'bip39',
	'buffer',
	'stream',
	'string_decoder',
	'electron',
	'react-copy-to-clipboard',
	'numeral',
	'dayjs',
	'qrcode.react',
	'redux',
	'redux-thunk',
	'lodash.debounce',
	'events',
	'readable-stream',
	'util',
]

if (process.env.NODE_ENV === 'development') {
	window.require = require;
} else {
	window.require = function(module) {
		if (moduleWhiteList.includes(module)) {
			return require(module)
		}
	}
}

window.nodeBuffer = Buffer;
