export type WindowActiveState = 'focused' | 'blurred';

export type DelegationType = 'indefinite' | 'limited';

export enum ApiResource {
  Mempool = 'mempool',
  Nonce = 'nonce',
  DelegationStatus = 'delegation-status',
  FeeRate = 'fee-rate',
}

declare global {
  const CONFIG: {
    NODE_ENV: 'development' | 'production' | 'test';
    DEBUG_PROD: string;
    STX_NETWORK: 'testnet' | 'mainnet';
    PLAIN_HMR?: string;
    START_HOT: boolean;
    PORT?: number;
    PULL_REQUEST?: string;
    BRANCH_NAME?: string;
    SHA?: string;
  };
}
