import axios from 'axios';
import {
  Transaction,
  TransactionResults,
  MempoolTransaction,
  AddressBalanceResponse,
} from '@blockstack/stacks-blockchain-api-types';

const api = 'https://stacks-node-api-latest.argon.blockstack.xyz/extended';

async function getAddressBalance(address: string) {
  return axios.get<AddressBalanceResponse>(api + `/v1/address/${address}/balances`);
}

async function getAddressTransactions(address: string) {
  return axios.get<TransactionResults>(api + `/v1/address/${address}/transactions`);
}

async function getTxDetails(txid: string) {
  return axios.get<Transaction | MempoolTransaction>(api + `/v1/tx/${txid}`);
}

async function getFaucetStx(address: string) {
  return axios.post(api + `/v1/debug/faucet?address=${address}`, { address });
}

export const Api = {
  getAddressBalance,
  getAddressTransactions,
  getTxDetails,
  getFaucetStx,
};
