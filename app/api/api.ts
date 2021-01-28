import axios from 'axios';
import urljoin from 'url-join';
import {
  AccountsApi,
  TransactionsApi,
  Configuration,
  SmartContractsApi,
  GetContractDataMapEntryRequest,
} from '@stacks/blockchain-api-client';
import {
  Transaction,
  TransactionResults,
  MempoolTransaction,
  AddressBalanceResponse,
  CoreNodePoxResponse,
  CoreNodeInfoResponse,
  NetworkBlockTimesResponse,
} from '@blockstack/stacks-blockchain-api-types';

export class Api {
  stacksApiConfig = new Configuration({
    basePath: this.baseUrl,
  });

  accountsApi = new AccountsApi(this.stacksApiConfig);
  transactionApi = new TransactionsApi(this.stacksApiConfig);
  smartContractsApi = new SmartContractsApi(this.stacksApiConfig);

  constructor(public baseUrl: string) {}

  async getAddressBalance(address: string) {
    return axios.get<AddressBalanceResponse>(
      urljoin(this.baseUrl, `/extended/v1/address/${address}/balances`)
    );
  }

  async getNonce(address: string) {
    const { data } = await axios.get(urljoin(this.baseUrl, `/v2/accounts/${address}`));
    return data;
  }

  async getAddressTransactions(address: string) {
    return axios.get<TransactionResults>(
      urljoin(this.baseUrl, `/extended/v1/address/${address}/transactions`),
      {
        params: {
          limit: 50,
        },
      }
    );
  }

  async getTxDetails(txid: string) {
    return axios.get<Transaction | MempoolTransaction>(
      urljoin(this.baseUrl, `/extended/v1/tx/${txid}`)
    );
  }

  async getFaucetStx(address: string, stacking?: boolean) {
    return axios.post(
      urljoin(
        this.baseUrl,
        `/extended/v1/faucets/stx?address=${address}${stacking ? '&stacking=true' : ''}`
      )
    );
  }

  async getFeeRate() {
    return axios.get<string>(urljoin(this.baseUrl, `/v2/fees/transfer`));
  }

  async getPoxInfo() {
    return axios.get<CoreNodePoxResponse>(urljoin(this.baseUrl, `/v2/pox`));
  }

  async getNodeStatus() {
    return axios.post(urljoin(this.baseUrl, `/extended/v1/status`));
  }

  async getCoreDetails() {
    return axios.get<CoreNodeInfoResponse>(urljoin(this.baseUrl, `/v2/info`));
  }

  async getNetworkBlockTimes() {
    return axios.get<NetworkBlockTimesResponse>(
      urljoin(this.baseUrl, `/extended/v1/info/network_block_times`)
    );
  }

  async getContractDataMapEntry(args: GetContractDataMapEntryRequest) {
    return this.smartContractsApi.getContractDataMapEntry({ ...args, proof: 0 });
  }

  async getMempoolTransactions(address: string): Promise<MempoolTransaction[]> {
    const mempoolTxs = await axios.get(
      urljoin(this.baseUrl, `/extended/v1/tx/mempool?limit=200&address=${address}`)
    );
    return mempoolTxs.data.results;
  }

  async callReadOnly({
    contract,
    functionName,
    args,
  }: {
    contract: string;
    functionName: string;
    args: string[];
  }) {
    const [contractAddress, contractName] = contract.split('.');
    const url = urljoin(
      this.baseUrl,
      `/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`
    );
    const body = {
      sender: 'ST384HBMC97973427QMM58NY2R9TTTN4M599XM5TD',
      arguments: args,
    };
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.result as string;
  }
}
