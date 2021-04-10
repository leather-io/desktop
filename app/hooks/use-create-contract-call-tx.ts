import { useCallback } from 'react';
import { ContractCallOptions } from '@stacks/transactions';

import { useWalletType } from './use-wallet-type';
import { useCreateSoftwareContractCallTx } from './use-create-software-contract-call-tx';
import { useCreateLedgerContractCallTx } from './use-create-ledger-contract-call-tx';

export function useCreateContractCallTx() {
  const { whenWallet } = useWalletType();
  const { createSoftwareContractCallTx } = useCreateSoftwareContractCallTx();
  const { createLedgerContractCallTx } = useCreateLedgerContractCallTx();

  return useCallback(
    async (txOptions: ContractCallOptions, privateKey?: string) =>
      whenWallet({
        async software() {
          if (!privateKey) throw new Error('Software wallet txs require private key');
          return createSoftwareContractCallTx({ txOptions, privateKey });
        },
        async ledger() {
          return createLedgerContractCallTx({ ...txOptions });
        },
      })(),
    [createLedgerContractCallTx, createSoftwareContractCallTx, whenWallet]
  );
}
