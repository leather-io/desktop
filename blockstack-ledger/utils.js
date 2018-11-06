'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMultiSigInfo = getMultiSigInfo;
exports.getCoinName = getCoinName;
exports.getTransaction = getTransaction;
exports.serializeOutputHex = serializeOutputHex;

var _bitcoinjsLib = require('bitcoinjs-lib');

var _bitcoinjsLib2 = _interopRequireDefault(_bitcoinjsLib);

var _blockstack = require('blockstack');

var _varuintBitcoin = require('varuint-bitcoin');

var _varuintBitcoin2 = _interopRequireDefault(_varuintBitcoin);

require('cross-fetch/polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KNOWN_TX_MAP = {};

function getMultiSigInfo(publicKeys, signersRequired) {
  var redeem = _bitcoinjsLib2.default.payments.p2ms({ m: signersRequired, pubkeys: publicKeys });
  var script = _bitcoinjsLib2.default.payments.p2sh({ redeem: redeem });
  var address = script.address;
  return {
    address: _blockstack.config.network.coerceAddress(address),
    redeemScript: redeem.output.toString('hex')
  };
}

function getCoinName() {
  var network = _blockstack.config.network.layer1;
  if (network.pubKeyHash === 0) {
    return 'bitcoin';
  } else if (network.pubKeyHash === 111) {
    return 'testnet';
  }
  throw new Error('Unknown layer 1 network');
}

function getTransaction(txId) {
  if (txId in KNOWN_TX_MAP) {
    return Promise.resolve(Buffer.from(KNOWN_TX_MAP[txId], 'hex'));
  }
  if (getCoinName() === 'testnet') {
    return getTransactionBitcoind(txId);
  }

  var apiUrl = 'https://blockchain.info/rawtx/' + txId + '?format=hex';
  return fetch(apiUrl).then(function (x) {
    if (!x.ok) {
      throw new Error('failed to get raw TX');
    }
    return x.text();
  }).then(function (x) {
    return Buffer.from(x, 'hex');
  });
}

// https://github.com/feross/buffer/blob/master/index.js#L1127
function verifuint(value, max) {
  if (typeof value !== 'number') throw new Error('cannot write a non-number as a number');
  if (value < 0) throw new Error('specified a negative value for writing an unsigned value');
  if (value > max) throw new Error('RangeError: value out of range');
  if (Math.floor(value) !== value) throw new Error('value has a fractional component');
}

function writeUInt64LE(buffer, value, offset) {
  verifuint(value, 0x001fffffffffffff);
  buffer.writeInt32LE(value & -1, offset);
  buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4);
  return offset + 8;
}

function varSliceSize(someScript) {
  var length = someScript.length;
  return _varuintBitcoin2.default.encodingLength(length) + length;
}

function serializeOutputHex(tx) {
  /*
    Cribbed from bitcoinjs-lib.
  */
  var byteLength = tx.outs.reduce(function (sum, output) {
    return sum + 8 + varSliceSize(output.script);
  }, _varuintBitcoin2.default.encodingLength(tx.outs.length));
  var buffer = Buffer.alloc(byteLength, 0);

  var offset = 0;
  function writeSlice(slice) {
    offset += slice.copy(buffer, offset);
  }
  function writeUInt64(i) {
    offset = writeUInt64LE(buffer, i, offset);
  }
  function writeVarInt(i) {
    _varuintBitcoin2.default.encode(i, buffer, offset);
    offset += _varuintBitcoin2.default.encode.bytes;
  }
  function writeVarSlice(slice) {
    writeVarInt(slice.length);writeSlice(slice);
  }

  writeVarInt(tx.outs.length);
  tx.outs.forEach(function (txOut) {
    if (!txOut.valueBuffer) {
      writeUInt64(txOut.value);
    } else {
      writeSlice(txOut.valueBuffer);
    }
    writeVarSlice(txOut.script);
  });

  return buffer.toString('hex');
}

function getTransactionBitcoind(txId) {
  var bitcoindUrl = _blockstack.config.network.btc.bitcoindUrl;
  var bitcoindCredentials = _blockstack.config.network.btc.bitcoindCredentials;

  var jsonRPC = {
    jsonrpc: '1.0',
    method: 'getrawtransaction',
    params: [txId]
  };

  var authString = Buffer.from(bitcoindCredentials.username + ':' + bitcoindCredentials.password).toString('base64');
  var headers = { Authorization: 'Basic ' + authString };
  return fetch(bitcoindUrl, {
    method: 'POST',
    body: JSON.stringify(jsonRPC),
    headers: headers
  }).then(function (resp) {
    return resp.json();
  }).then(function (json) {
    return Buffer.from(json.result, 'hex');
  });
}