// @flow
import bip39 from 'bip39'
import bip32 from 'bip32'
import crypto from 'crypto'
import btc from 'bitcoinjs-lib'
import bigi from 'bigi'
import { network, transactions, config} from 'blockstack'
import Transport from '@ledgerhq/hw-transport-node-hid'
import AppBtc  from '@ledgerhq/hw-app-btc'
import { c32address, c32ToB58, versions } from 'c32check'
// import TrezorConnect from 'trezor-connect'
import TrezorConnect from '../../trezor/trezor'
import { encryptECIES } from '../utils/encryption'
import { getPrivateKeyAddress, sumUTXOs } from '../utils/utils'
import { TrezorSigner, configureTestnet } from '../../blockstack-trezor'
import { LedgerSigner } from '../../blockstack-ledger'

export const WALLET_TYPE = {
	NORMAL: 'NORMAL',
	HARDWARE: 'HARDWARE',
	MULTISIG: 'MULTISIG'
}

const BSKPK = '03956cd9ba758cb7be56d0f8d52476673814d8dbb3c1a728d73a36b3b9268f9cba'
const path = `m/44'/5757'/0'/0/0`
const coreNodeURI = 'http://testnet.blockstack.org:16268'
const testnetCoreNodeURI = 'http://testnet.blockstack.org:16268'

const TESTNET_ADDRESS_PREFIX = {
  wif: 0x6F,
  bip32: {
    public: 0x043587cf,
    private: 0x04358394
  }
}

export const ACCEPT_TERMS = 'ACCEPT_TERMS'
export const CREATE_WALLET = 'CREATE_WALLET'
export const SET_NAME = 'SET_NAME'
export const CREATE_NEW_SEED = 'NEW_SEED'
export const USE_HARDWARE_WALLET = 'USE_HARDWARE_WALLET'
export const SET_ADDRESS = 'SET_ADDRESS'
export const UPDATE_BALANCE = 'UPDATE_BALANCE'
export const SET_HARDWARE_ERROR = 'SET_HARDWARE_ERROR'
export const SET_PAYLOAD = 'SET_PAYLOAD'
export const ERASE_DATA = 'ERASE_DATA'
export const ERASE_SEED = 'ERASE_SEED'

export function acceptTerms() {
	return {
		type: ACCEPT_TERMS
	}
}

export function createWallet(stacksAddress: string, btcAddress: string, type: string) {
	return {
		type: CREATE_WALLET,
		stacksAddress,
		btcAddress,
		walletType: type
	}
}

export function updateName(name: string) {
	return (dispatch) => new Promise((resolve) => {
		resolve(dispatch({
			type: SET_NAME,
			name: name
		}))
	})
}

export function updateSeed(seed: string, address: string, publicKey: string) {
  return {
    type: CREATE_NEW_SEED,
    seed,
    address,
    publicKey
  };
}

export function eraseData() {
	return {
		type: ERASE_DATA
	}
}

export function eraseSeed() {
	return {
		type: ERASE_SEED
	}
}

export function updatePubKey(address: string, publicKey: string) {
  return {
    type: USE_HARDWARE_WALLET,
    address,
    publicKey
  };
}

export function updateAddress(address: string) {
  return {
    type: SET_ADDRESS,
    address
  };
}

export function updateBalance(stacksBalance: number) {
	return {
		type: UPDATE_BALANCE,
		stacksBalance
	}
}

export function updateHardwareError(error: string) {
  return {
    type: SET_HARDWARE_ERROR,
    error
  };
}

export function updatePayload(payload) {
	return {
		type: SET_PAYLOAD,
		payload
	}
}

export function generateNewSeed() {
	const entropy = crypto.randomBytes(32)
	const seedPhrase = bip39.entropyToMnemonic(entropy)

	const { address, publicKey } = getBtcAddress(seedPhrase)

	return dispatch => {
		dispatch(updateSeed(seedPhrase, address, publicKey))
	}
}

export function setupWallet(stacksAddress, btcAddress, type) {
	return dispatch => new Promise((resolve) => {
		resolve(dispatch(createWallet(stacksAddress, btcAddress, type)))
	})
}

export function restoreFromSeed(seedPhrase) {
	return (dispatch) => new Promise((resolve) => {
		const { address, publicKey } = getBtcAddress(seedPhrase)

		resolve(dispatch(updateSeed(seedPhrase, address, publicKey)))
	})
}

export function getBtcAddress(seedPhrase) {
	const seed = bip39.mnemonicToSeed(seedPhrase)

	const master = bip32.fromSeed(seed)
	const child = master.derivePath(`m/44'/5757'/0'/0/0`)

	var SHA256 = crypto.createHash('SHA256')
	var RIPEMD160 = crypto.createHash('RIPEMD160')

	SHA256.update(child.publicKey)
	var pk256 = SHA256.digest()
	RIPEMD160.update(pk256)
	var pk160 = RIPEMD160.digest()

  const address = c32address(versions.mainnet.p2pkh,
                               pk160.slice(0, 20).toString('hex'))
	const publicKey = child.publicKey.toString('hex')

	return { address, publicKey }
}

export function getTrezorAddr() {
  return (dispatch) => new Promise((resolve, reject) => {
    // TrezorConnect.setCurrency('TEST')
    TrezorConnect.setCurrency('BTC')
    TrezorConnect.getXPubKey(path, function (result) {
      if (result.success) {
        // const child = bip32.fromBase58(result.xpubkey, TESTNET_ADDRESS_PREFIX)
        // const stacksAddress = getAddressFromChildPubKey(child.publicKey, versions.testnet.p2pkh)
        const child = bip32.fromBase58(result.xpubkey)
        const stacksAddress = getAddressFromChildPubKey(child.publicKey)
        const btcAddress = c32ToB58(stacksAddress)
        resolve({stacksAddress, btcAddress})
      } else {
        const error = 'Failed to get address from Trezor'
        dispatch(updateHardwareError(error))
        reject()
      }
    })
  })
}

export function getLedgerAddr() {
  return (dispatch) => new Promise((resolve, reject) => {
    Transport.create()
      .then((transport) => new AppBtc(transport))
      .then((btc) => btc.getWalletPublicKey(path))
      .then((ledgerPK) => ledgerPK.publicKey)
      .then((publicKey) => {
        var ecPair = btc.ECPair.fromPublicKey(Buffer.from(publicKey, 'hex'))
        ecPair.compressed = true
        var pkBuffer = ecPair.publicKey
        const stacksAddress = getAddressFromChildPubKey(pkBuffer)
        const btcAddress = c32ToB58(stacksAddress)
        resolve({stacksAddress, btcAddress})
      })
      .catch((err) => {
        const error = 'Failed to get address from Ledger'
        dispatch(updateHardwareError(error))
        reject()
      })
  })
}

export function makeMultiSig(publicKeys: Array<string>, signaturesRequired: number) {
	return (dispatch) => new Promise((resolve, reject) => {
		if (signaturesRequired <= 0) {
	    throw new Error('Signatures required must be >= 1')
	  }
	  if (signaturesRequired > publicKeys.length) {
	    throw new Error('Signatures required must be <= the number of public keys')
	  }

	  const publicKeyBuffers = publicKeys.map(hex => Buffer.from(hex, 'hex'))
	  const redeemScript = btc.script.multisig.output.encode(parseInt(signaturesRequired), publicKeyBuffers)
	  const scriptPubKey = btc.script.scriptHash.output.encode(
	    btc.crypto.hash160(redeemScript))
	  const scriptHash = btc.script.compile(scriptPubKey).slice(2, 22)

	  const address = c32address(versions.mainnet.p2sh,
                                 scriptHash.toString('hex'))

	  dispatch(updateAddress(address))
	  resolve({ address, payload: redeemScript.toString('hex') })
	})
}

export function generatePayload(name: string, publicKey: string) {
	return (dispatch) => new Promise((resolve, reject) => {
		const payload = JSON.stringify({
			name,
			publicKey
		})

		const encrypted = JSON.stringify(encryptECIES(BSKPK, payload))
		const b64Payload = Buffer.from(encrypted).toString('base64')

		dispatch(updatePayload(b64Payload))
		resolve(b64Payload)
	})
}

export function generateMultiSigPayload(name: string, redeemScript: string) {
	return (dispatch) => new Promise((resolve, reject) => {
		const payload = JSON.stringify({
			name,
			redeemScript
		})

		const encrypted = JSON.stringify(encryptECIES(BSKPK, payload))
		const b64Payload = Buffer.from(encrypted).toString('base64')

		dispatch(updatePayload(b64Payload))
		resolve(b64Payload)
	})
}

export function getStacksBalance(address) {
	return (dispatch) => new Promise((resolve, reject) => {
		fetch(`${coreNodeURI}/v1/accounts/${address}/STACKS/status`)
			.then(resp => {
				if(resp.status == 200) {
					return resp.json()
				} else {
					throw new Error('Balance check request returned error')
				}
			})
			.then(resp => {
				const balance = resp.credit_value - resp.debit_value
				dispatch(updateBalance(balance))
			})
			.catch(err => {
				console.log(err)
			})
	})
}

// export function sendTokens(network: Object, address: string, amount: string) {
export function sendTokens(senderAddress: string, recipientAddress: string, amount: string, walletType: string) {
	return (dispatch) => new Promise((resolve, reject) => {
		const senderBtcAddress = c32ToB58(senderAddress)
	  const recipientBtcAddress = c32ToB58(recipientAddress) 
	  const tokenType = "STACKS"
	  const tokenAmount = bigi.fromByteArrayUnsigned(amount)
	  const memo = ""

	  // configureTestnet()

	  let signer
	  if (walletType === 'trezor') {
	  	signer = new TrezorSigner(path, senderBtcAddress)	
	  } else {
	  	signer = new LedgerSigner(path, senderBtcAddress)
	  }
	 
	  const txPromise = transactions.makeTokenTransfer(
	    recipientBtcAddress, tokenType, tokenAmount, memo, signer);

    return txPromise.then((tx) => {
      return config.network.broadcastTransaction(tx);
    })
	})
}

function getAddressFromChildPubKey(child, version_prefix) {
  if (child.length != 33) {
    throw new Error('Invalid public key buffer length, expecting 33 bytes')
  }
  var SHA256 = crypto.createHash('SHA256')
  var RIPEMD160 = crypto.createHash('RIPEMD160')

  SHA256.update(child)
  var pk256 = SHA256.digest()
  RIPEMD160.update(pk256)
  var pk160 = RIPEMD160.digest()

  const prefix = version_prefix || versions.mainnet.p2pkh
  const address = c32address(prefix,
                             pk160.slice(0, 20).toString('hex'))

  return address
}
