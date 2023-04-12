import { SignTransactionLedger } from './sign-transaction-ledger';
import { SignTransactionSoftware } from './sign-transaction-software';
import { useWalletType } from '@hooks/use-wallet-type';
import { ContractCallOptions, StacksTransaction, TokenTransferOptions } from '@stacks/transactions';
import React from 'react';

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
