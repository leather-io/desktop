'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LedgerMultiSigSigner = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _blockstack = require('blockstack');

var _bitcoinjsLib = require('bitcoinjs-lib');

var _bitcoinjsLib2 = _interopRequireDefault(_bitcoinjsLib);

var _ablanksteinLedgerHwAppBtc = require('ablankstein-ledger-hw-app-btc');

var _ablanksteinLedgerHwAppBtc2 = _interopRequireDefault(_ablanksteinLedgerHwAppBtc);

var _utils = require('./utils');

var _LedgerSigner = require('./LedgerSigner');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MockKeyPair = function () {
  function MockKeyPair(signature, publicKey) {
    _classCallCheck(this, MockKeyPair);

    this.signature = signature;
    this.publicKey = publicKey;
  }

  _createClass(MockKeyPair, [{
    key: 'sign',
    value: function sign() {
      return this.signature;
    }
  }]);

  return MockKeyPair;
}();

var LedgerMultiSigSigner = exports.LedgerMultiSigSigner = function () {
  function LedgerMultiSigSigner(hdPath, redeemScript, transportInterface) {
    _classCallCheck(this, LedgerMultiSigSigner);

    this.transportInterface = transportInterface;
    this.hdPath = hdPath;
    this.redeemScript = Buffer.from(redeemScript, 'hex');
    this.publicKey = undefined;
  }

  _createClass(LedgerMultiSigSigner, [{
    key: 'obtainAppInterface',
    value: function obtainAppInterface() {
      return this.transportInterface.create().then(function (transport) {
        return new _ablanksteinLedgerHwAppBtc2.default(transport);
      });
    }
  }, {
    key: 'getPublicKey',
    value: function getPublicKey() {
      var _this = this;

      if (this.publicKey) {
        return Promise.resolve(this.publicKey);
      } else {
        return _LedgerSigner.LedgerSigner.getPublicKeys(this.transportInterface, [this.hdPath]).then(function (pubkeys) {
          return Buffer.from(pubkeys[0], 'hex');
        }).then(function (pkBuffer) {
          _this.publicKey = pkBuffer;
          return pkBuffer;
        });
      }
    }
  }, {
    key: 'getAddress',
    value: function getAddress() {
      var p2ms = _bitcoinjsLib2.default.payments.p2ms({ output: this.redeemScript });
      var p2sh = _bitcoinjsLib2.default.payments.p2sh({ redeem: p2ms });
      return Promise.resolve(_blockstack.config.network.coerceAddress(p2sh.address));
    }
  }, {
    key: 'prepareInputs',
    value: function prepareInputs(tx, signInputIndex, appBtc) {
      var _this2 = this;

      var inputScripts = tx.ins.map(function (input, index) {
        if (index !== signInputIndex) {
          return input.script.toString('hex');
        } else {
          return null;
        }
      });

      var inputsPromises = tx.ins.map(function (input, index) {
        var txId = Buffer.from(input.hash).reverse().toString('hex');
        var outputN = input.index;
        var redeemScript = index === signInputIndex ? _this2.redeemScript.toString('hex') : undefined;
        return (0, _utils.getTransaction)(txId).then(function (transaction) {
          var hasWitness = _bitcoinjsLib2.default.Transaction.fromHex(transaction).hasWitnesses();
          return appBtc.splitTransaction(transaction, hasWitness);
        }).then(function (preparedTx) {
          return [preparedTx, outputN, redeemScript, input.sequence];
        });
      });

      return Promise.all(inputsPromises).then(function (inputs) {
        return { inputs: inputs, inputScripts: inputScripts };
      });
    }
  }, {
    key: 'prepareTransactionInfo',
    value: function prepareTransactionInfo(tx, signInputIndex, appBtc) {
      var _this3 = this;

      var sigHashType = 1; // SIGHASH_ALL
      var signPaths = tx.ins.map(function (input, index) {
        if (index === signInputIndex) {
          return _this3.hdPath;
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
      var _this4 = this;

      return this.signTransactionSkeleton(txB.__tx, signInputIndex).then(function (signaturesHex) {
        if (signaturesHex.length !== 1) {
          throw new Error('Unexpected number of signatures (' + signaturesHex.length + ' > 1)');
        }
        return _this4.getPublicKey().then(function (publicKey) {
          // god of abstraction, forgive me, for I have transgressed
          // add an '01' to convince btcjs to decompile our DER signature
          var sigBuffer = Buffer.from(signaturesHex[0] + '01', 'hex');
          var decompiled = _bitcoinjsLib2.default.script.signature.decode(sigBuffer);
          var signer = new MockKeyPair(decompiled.signature, publicKey);
          console.log(decompiled.signature.toString('hex'));
          txB.sign(signInputIndex, signer, _this4.redeemScript);
        });
      });
    }
  }, {
    key: 'signTransactionSkeleton',
    value: function signTransactionSkeleton(tx, signInputIndex) {
      var _this5 = this;

      return this.obtainAppInterface().then(function (appBtc) {
        return _this5.prepareTransactionInfo(tx, signInputIndex, appBtc).then(function (txInfo) {
          return appBtc.signP2SHTransaction(txInfo.inputs, txInfo.signPaths, txInfo.outputHex, txInfo.lockTime, txInfo.sigHashType, false, 1);
        });
      }).catch(function (err) {
        console.log(err);
        console.log(err.stack);
        console.log(err.message);
        console.log(err.statusCode);
        console.log(err.statusText);
      });
    }
  }]);

  return LedgerMultiSigSigner;
}();