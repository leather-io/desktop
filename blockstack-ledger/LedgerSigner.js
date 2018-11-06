'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LedgerSigner = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _blockstack = require('blockstack');

var _bitcoinjsLib = require('bitcoinjs-lib');

var _bitcoinjsLib2 = _interopRequireDefault(_bitcoinjsLib);

var _ablanksteinLedgerHwAppBtc = require('ablankstein-ledger-hw-app-btc');

var _ablanksteinLedgerHwAppBtc2 = _interopRequireDefault(_ablanksteinLedgerHwAppBtc);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LedgerSigner = exports.LedgerSigner = function () {
  function LedgerSigner(hdPath, transportInterface) {
    _classCallCheck(this, LedgerSigner);

    this.hdPath = hdPath;
    this.transportInterface = transportInterface;
    this.address = null;
  }

  _createClass(LedgerSigner, [{
    key: 'obtainAppInterface',
    value: function obtainAppInterface() {
      return this.transportInterface.create().then(function (transport) {
        return new _ablanksteinLedgerHwAppBtc2.default(transport);
      });
    }

    // Return the public key string

  }, {
    key: 'getAddress',
    value: function getAddress() {
      var _this = this;

      if (this.address) {
        return Promise.resolve(this.address);
      } else {
        return this.obtainAppInterface().then(function (device) {
          return device.getWalletPublicKey(_this.hdPath, false, false);
        }).then(function (result) {
          _this.address = _blockstack.config.network.coerceAddress(result.bitcoinAddress);
          return _this.address;
        });
      }
    }
  }, {
    key: 'prepareInputs',
    value: function prepareInputs(tx, signInputIndex, appBtc) {
      var inputScripts = tx.ins.map(function (input, index) {
        if (index !== signInputIndex) {
          return input.script.toString('hex');
        } else {
          return null;
        }
      });

      var inputsPromises = tx.ins.map(function (input) {
        var txId = Buffer.from(input.hash).reverse().toString('hex');
        var outputN = input.index;
        return (0, _utils.getTransaction)(txId).then(function (transaction) {
          var hasWitness = _bitcoinjsLib2.default.Transaction.fromHex(transaction).hasWitnesses();
          return appBtc.splitTransaction(transaction, hasWitness);
        }).then(function (preparedTx) {
          return [preparedTx, outputN, undefined, input.sequence];
        });
      });

      return Promise.all(inputsPromises).then(function (inputs) {
        return { inputs: inputs, inputScripts: inputScripts };
      });
    }
  }, {
    key: 'prepareTransactionInfo',
    value: function prepareTransactionInfo(tx, signInputIndex, appBtc) {
      var _this2 = this;

      var sigHashType = 1; // SIGHASH_ALL
      var signPaths = tx.ins.map(function (input, index) {
        if (index === signInputIndex) {
          return _this2.hdPath;
        } else {
          return null;
        }
      });
      var outputHex = (0, _utils.serializeOutputHex)(tx);
      var lockTime = tx.locktime;
      return this.prepareInputs(tx, signInputIndex, appBtc).then(function (result) {
        var inputs = result.inputs,
            inputScripts = result.inputScripts;

        return { inputs: inputs, inputScripts: inputScripts, signPaths: signPaths,
          outputHex: outputHex, lockTime: lockTime, sigHashType: sigHashType };
      });
    }
  }, {
    key: 'signTransaction',
    value: function signTransaction(txB, signInputIndex) {
      return this.signTransactionSkeleton(txB.__tx, signInputIndex).then(function (signedTxHex) {
        // god of abstraction, forgive me, for I have transgressed
        var signedTx = _bitcoinjsLib2.default.Transaction.fromHex(signedTxHex);
        var signedTxB = _bitcoinjsLib2.default.TransactionBuilder.fromTransaction(signedTx);
        txB.__inputs[signInputIndex] = signedTxB.__inputs[signInputIndex];
      });
    }
  }, {
    key: 'signTransactionSkeleton',
    value: function signTransactionSkeleton(tx, signInputIndex) {
      var _this3 = this;

      return this.obtainAppInterface().then(function (appBtc) {
        return _this3.prepareTransactionInfo(tx, signInputIndex, appBtc).then(function (txInfo) {
          return appBtc.createPaymentTransactionNew(txInfo.inputs, txInfo.signPaths, undefined, txInfo.outputHex, txInfo.lockTime, txInfo.sigHashType, false, undefined, undefined, undefined, txInfo.inputScripts);
        });
      }).catch(function (err) {
        console.log(err);
        console.log(err.stack);
        console.log(err.message);
        console.log(err.statusCode);
        console.log(err.statusText);
      });
    }
  }], [{
    key: 'getPublicKeys',
    value: function getPublicKeys(transportInterface, paths) {
      var results = [];
      return transportInterface.create().then(function (transport) {
        return new _ablanksteinLedgerHwAppBtc2.default(transport);
      }).then(function (ledger) {
        return paths.reduce(function (promise, path) {
          return promise.then(function (prior) {
            if (prior) {
              results.push(prior);
            }
            return ledger.getWalletPublicKey(path, false, false);
          });
        }, Promise.resolve()).then(function (finalResult) {
          return results.push(finalResult);
        });
      }).then(function () {
        return results.map(function (result) {
          var uncompressed = result.publicKey;
          var ecPair = _bitcoinjsLib2.default.ECPair.fromPublicKey(Buffer.from(uncompressed, 'hex'));
          ecPair.compressed = true;
          return ecPair.publicKey;
        });
      }).then(function (pubkeyBuffers) {
        return pubkeyBuffers.map(function (pk) {
          return pk.toString('hex');
        });
      });
    }
  }]);

  return LedgerSigner;
}();