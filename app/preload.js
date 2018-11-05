window.module = module;
window.require = require;
// window.require = function(module) {
// 	if(module==='url') {
// 		return require('url');
// 	} else if (module==='events') {
// 		return require('events');
// 	} else if (module==='buffer') {
// 		return require('buffer');
// 	} else if (module==='stream') {
// 		return require('stream');
// 	} else if (module==='string_decoder') {
// 		return require('string_decoder')
// 	} else if (module==='crypto') {
// 		return require('crypto')
// 	} else if (module==='assert') {
// 		return require('assert')
// 	} else if (module==='bip32') {
// 		return require('bip32')
// 	} else if (module==='electron') {
// 		var remote = require('electron').remote
// 		return { remote }
// 	} else if (module==='@ledgerhq/hw-transport-node-hid') {
// 		return require('@ledgerhq/hw-transport-node-hid')
// 	} else if (module==='@ledgerhq/hw-app-btc') {
// 		return require('@ledgerhq/hw-app-btc')
// 	} else if (module==='blockstack') {
// 		return require('blockstack')
// 	} else if (module==='trezor-connect') {
// 		return require('trezor-connect')
// 	} 
// }
window.nodeBuffer = Buffer;
