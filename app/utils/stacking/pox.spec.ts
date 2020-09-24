import {
  makeRandomPrivKey,
  getAddressFromPrivateKey,
  TransactionVersion,
} from '@blockstack/stacks-transactions';
import { POX } from './pox';
import { Api } from '../../api/api';
import BN from 'bn.js';
import * as bitcoin from 'bitcoinjs-lib';

const client = new POX();
const api = new Api('http://localhost:3999');

const btcAddress = '17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem';

const waitForTxConfirm = (txid: string) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const getTX = async (interval: number) => {
        try {
          const txResponse = await api.getTxDetails(txid);
          if (txResponse.data.tx_status === 'success') {
            clearInterval(interval);
            return resolve(true);
          } else if (txResponse.data.tx_status === 'abort_by_response') {
            clearInterval(interval);
            return reject(txResponse.data.tx_result);
          }
        } catch (error) {
          // nothing
        }
      };
      void getTX(interval);
    }, 500);
  });
};

test('making a lock-stx transaction', async () => {
  const keyPair = bitcoin.ECPair.makeRandom();
  const { address: poxAddress } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  if (!poxAddress) {
    throw new Error('No btc address');
  }
  const key = makeRandomPrivKey();
  const address = getAddressFromPrivateKey(key.data, TransactionVersion.Testnet);
  const faucetResponse = await api.getFaucetStx(address);
  await waitForTxConfirm(faucetResponse.data.txId);
  const lockTxid = await client.lockSTX({
    amountSTX: 50500000010000 + 500,
    cycles: 1,
    poxAddress,
    key: key.data.toString('hex'),
  });
  await waitForTxConfirm(`0x${lockTxid}`);
  const stackerInfo = await client.getStackerInfo(address);
  console.log('Stacker Info:');
  console.log('Amount Locked:', stackerInfo.amountSTX.toString(10));
  console.log('Lock Period:', stackerInfo.lockPeriod.toString(10));
  console.log('Address Version:', stackerInfo.poxAddr.version.toString('hex'));
  console.log('Address Hashbytes:', stackerInfo.poxAddr.hashbytes.toString('hex'));
  console.log('Bitcoin Address', stackerInfo.btcAddress);
  const btcReconstruced = client.getBTCAddress(
    stackerInfo.poxAddr.version,
    stackerInfo.poxAddr.hashbytes
  );
  expect(btcReconstruced).toEqual(poxAddress);
  expect(stackerInfo.amountSTX.eq(new BN(50500000010000 + 500, 10))).toBeTruthy();
  expect(stackerInfo.lockPeriod.eq(new BN(1, 10))).toBeTruthy();
  expect(stackerInfo.poxAddr.version).toEqual(Buffer.from('00', 'hex'));
  expect(stackerInfo.btcAddress).toEqual(poxAddress);
}, 55_000);

test('can turn btc address into version, checksum', () => {
  const { version, hash } = client.convertBTCAddress(btcAddress);
  expect(version).toEqual(0);
  expect(hash.toString('hex')).toEqual('47376c6f537d62177a2c41c4ca9b45829ab99083');
  const reconstructed = client.getBTCAddress(new BN(version).toBuffer(), hash);
  expect(reconstructed).toEqual(btcAddress);
});

test('works with p2sh addresses', () => {
  const pubkeys = [
    '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
    '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
    '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
  ].map(hex => Buffer.from(hex, 'hex'));
  const { address: poxAddress } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
  });
  const converted = client.convertBTCAddress(poxAddress as string);
  expect(converted.version).toEqual(5);
});
