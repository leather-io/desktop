import axios from 'axios';
import {
  Transaction,
  TransactionResults,
  MempoolTransaction,
} from '@blockstack/stacks-blockchain-sidecar-types';

const api = 'https://sidecar.staging.blockstack.xyz/sidecar';

//
// TODO: move to sidecar repo, should be documented there
export interface AddressBalanceResponse {
  stx: {
    balance: string;
    total_sent: string;
    total_received: string;
  };
  fungible_tokens: any;
  non_fungible_tokens: any;
}

async function getAddressBalance(address: string) {
  return await axios.get<AddressBalanceResponse>(api + `/v1/address/${address}/balances`);
}

async function getAddressTransactions(address: string) {
  return await axios.get<TransactionResults>(api + `/v1/address/${address}/transactions`);
}

type AnyTransaction = Transaction | MempoolTransaction;

async function getTxDetails(txid: string) {
  return await axios.get<AnyTransaction>(api + `/v1/tx/${txid}/transactions`);
}
// async function getStxPriceInDollars() {
//   return await axios.get(
//     'https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd'
//   );
// }

export const Api = {
  getAddressBalance,
  getAddressTransactions,
  getTxDetails,
};
