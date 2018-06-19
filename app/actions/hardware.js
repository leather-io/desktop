import bip39 from 'bip39'
import bip32 from 'bip32'
import crypto from 'crypto'
import btc from 'bitcoinjs-lib'

import Transport from '@ledgerhq/hw-transport-node-hid'
import AppBtc  from '@ledgerhq/hw-app-btc'

var path = `m/44'/5757'/0'/0/0`

function getAddressFromChildPubKey(child) {
  if (child.length != 33) {
    throw new Error('Invalid public key buffer length, expecting 33 bytes')
  }
  var SHA256 = crypto.createHash('SHA256')
  var RIPEMD160 = crypto.createHash('RIPEMD160')

  SHA256.update(child)
  var pk256 = SHA256.digest()
  RIPEMD160.update(pk256)
  var pk160 = RIPEMD160.digest()

  var address = btc.address.toBase58Check(pk160, 0)
  return address
}

export function getTrezorAddr() {
  TrezorConnect.setCurrency('BTC')
  return new Promise((resolve, reject) => {
    TrezorConnect.getXPubKey(path, function (result) {
      if (result.success) {
        var child = bip32.fromBase58(result.xpubkey)
        var address = getAddressFromChildPubKey(child.publicKey)
        resolve({ address, publicKey: child.publicKey.toString('hex') })
      } else {
        reject(result.error)
      }
    })
  })
}

export function getLedgerAddr() {
  return Transport.create()
    .then((transport) => new AppBtc(transport))
    .then((btc) => btc.getWalletPublicKey(path))
    .then((ledgerPK) => ledgerPK.publicKey)
    .then((publicKey) => {
      var ecPair = btc.ECPair.fromPublicKeyBuffer(Buffer.from(publicKey, 'hex'))
      ecPair.compressed = true
      var publicKey = ecPair.getPublicKeyBuffer()
      var address = getAddressFromChildPubKey(publicKey)
      return { publicKey, address }
    })
}
