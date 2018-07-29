window.module = module;
window.require = function(module) {
	if(module==='url') {
		return require('url');
	} else if (module==='events') {
		return require('events');
	} else if (module==='buffer') {
		return require('buffer');
	} else if (module==='stream') {
		return require('stream');
	} else if (module==='string_decoder') {
		return require('string_decoder')
	} else if (module==='crypto') {
		return require('crypto')
	} else if (module==='assert') {
		return require('assert')
	} else if (module==='bip32') {
		return require('bip32')
	} else if (module==='electron') {
		var remote = require('electron').remote
		return { remote }
	}
}
window.nodeBuffer = Buffer;
