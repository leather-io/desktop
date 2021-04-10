import React from 'react';
import { ContractCallOptions, StacksTransaction, TokenTransferOptions } from '@stacks/transactions';

import { useWalletType } from '@hooks/use-wallet-type';

import { SignTransactionSoftware } from './sign-transaction-software';
import { SignTransactionLedger } from './sign-transaction-ledger';

export interface SignTransactionProps {
  action: string;
  txOptions: TokenTransferOptions | ContractCallOptions;
  isBroadcasting: boolean;
  onTransactionSigned(tx: StacksTransaction): void;
  onClose(): void;
}
export const SignTransaction = (props: SignTransactionProps) => {
  const { whenWallet } = useWalletType();

  return whenWallet({
    software: <SignTransactionSoftware {...props} />,
    ledger: <SignTransactionLedger {...props} />,
  });
};
