import btc from 'bitcoinjs-lib'
const bsk = require('blockstack')


export function getMultiSigInfo(publicKeys: [string], signersRequired: number) {
  const redeem = btc.payments.p2ms({ m: signersRequired, pubkeys: publicKeys.map(pk => Buffer.from(pk, 'hex')) })
  const script = btc.payments.p2sh({ redeem })
  const address = script.address
  return {
    address: bsk.config.network.coerceAddress(address),
    redeemScript: redeem.output.toString('hex')
  }
}

export function getCoinName() {
  const network = bsk.config.network.layer1
  if (network.pubKeyHash === 0) {
    return 'bitcoin'
  } else if (network.pubKeyHash === 111) {
    return 'testnet'
  }
  throw new Error('Unknown layer 1 network')
}

export function pathToPathArray (path) {
  const harden = 0x80000000
  const pieces = path.split('/')
  if (pieces.length === 1 || pieces[0] !== 'm') {
    throw new Error(`Invalid path ${path}`)
  }
  return pieces
    .slice(1)
    .map(x => {
      if (x.endsWith('\'')) {
        return (parseInt(x.slice(0)) | harden) >>> 0
      } else {
        return parseInt(x)
      }
    })
}

export function configureTestnet(blockstackTestnet = 'testnet.blockstack.org') {
  bsk.config.network = bsk.network.defaults.LOCAL_REGTEST
  bsk.config.network.blockstackAPIUrl    = `http://${blockstackTestnet}:16268`
  bsk.config.network.broadcastServiceUrl = `http://${blockstackTestnet}:16269`
  bsk.config.network.btc = new bsk.network.InsightClient('https://test-insight.bitpay.com/api')
  bsk.config.network.getFeeRate = () => Promise.resolve(1)
}
