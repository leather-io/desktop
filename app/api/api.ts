import axios from 'axios';
import urljoin from 'url-join';
import {
  Transaction,
  TransactionResults,
  MempoolTransaction,
  AddressBalanceResponse,
} from '@blockstack/stacks-blockchain-api-types';

export class Api {
  constructor(public baseUrl: string) {}

  async getAddressBalance(address: string) {
    return axios.get<AddressBalanceResponse>(
      urljoin(this.baseUrl, `/extended/v1/address/${address}/balances`)
    );
  }

  async getAddressTransactions(address: string) {
    return axios.get<TransactionResults>(
      urljoin(this.baseUrl, `/extended/v1/address/${address}/transactions`)
    );
  }

  async getTxDetails(txid: string) {
    return axios.get<Transaction | MempoolTransaction>(urljoin(this.baseUrl, `v1/tx/${txid}`));
  }

  async getFaucetStx(address: string) {
    return axios.post(urljoin(this.baseUrl, `/extended/v1/debug/faucet?address=${address}`), {
      address,
    });
  }

  async getNodeStatus() {
    return axios.post(urljoin(this.baseUrl, `/extended/v1/status`));
  }
}
