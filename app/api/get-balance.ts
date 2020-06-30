import axios from 'axios';
import { TransactionResults } from '@blockstack/stacks-blockchain-sidecar-types';

const api = 'https://sidecar.staging.blockstack.xyz/sidecar';

export async function getAddressBalance(address: string) {
  return await axios.get(api + `/v1/address/${address}/balances`);
}

export async function getAddressTransactions(address: string) {
  return await axios.get<TransactionResults>(api + `/v1/address/${address}/transactions`);
}
