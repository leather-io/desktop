import axios from 'axios';
import urljoin from 'url-join';
import {
  AccountsApi,
  TransactionsApi,
  Configuration,
  SmartContractsApi,
  GetContractDataMapEntryRequest,
  Middleware,
  RequestContext,
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
import { AddressTransactionsWithTransfersListResponse } from '@stacks/stacks-blockchain-api-types';
import packageJson from '../../package.json';
import { features } from '@constants/index';

const defaultHeaders = [
  { name: 'x-hiro-product', value: 'stacks-wallet-desktop' },
  { name: 'x-hiro-version', value: packageJson.version },
];

defaultHeaders.forEach(({ name, value }) => (axios.defaults.headers.common[name] = value));
export class Api {
  unanchoredMiddleware: Middleware = {
    pre: (context: RequestContext) => {
      const url = new URL(context.url);
      url.searchParams.set('unanchored', 'true');
      return Promise.resolve({
        init: context.init,
        url: url.toString(),
      });
    },
  };
  stacksApiConfig = new Configuration({
    basePath: this.baseUrl,
    headers: defaultHeaders.reduce((acc: Record<string, string>, hdr) => {
      acc[hdr.name] = hdr.value;
      return acc;
    }, {}),
    middleware: features.microblocks ? [this.unanchoredMiddleware] : [],
  });

  accountsApi = new AccountsApi(this.stacksApiConfig);
  transactionApi = new TransactionsApi(this.stacksApiConfig);
  smartContractsApi = new SmartContractsApi(this.stacksApiConfig);

  constructor(public baseUrl: string) {}

  async getAddressBalance(address: string) {
    return axios.get<AddressBalanceResponse>(
      urljoin(this.baseUrl, `/extended/v1/address/${address}/balances`),
      { params: { unanchored: true } }
    );
  }

  async getNonce(address: string) {
    const { data } = await axios.get(
      urljoin(this.baseUrl, `extended/v1/address/${address}/nonces`),
      { params: { unanchored: true } }
    );
    return data;
  }

  async getAddressTransactions(address: string) {
    return axios.get<TransactionResults>(
      urljoin(this.baseUrl, `/extended/v1/address/${address}/transactions`),
      {
        params: {
          limit: 50,
          unanchored: true,
        },
      }
    );
  }

  async getAddressTransactionsWithTransfers(address: string) {
    return axios.get<AddressTransactionsWithTransfersListResponse>(
      urljoin(this.baseUrl, `/extended/v1/address/${address}/transactions_with_transfers`),
      {
        params: {
          limit: 50,
          unanchored: true,
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
      urljoin(this.baseUrl, `/extended/v1/tx/mempool?limit=200&address=${address}`),
      { params: { unanchored: true } }
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
