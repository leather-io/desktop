import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import StacksApp, { LedgerError, ResponseSign } from '@zondax/ledger-blockstack';

import { RootState } from '@store/index';
import { STX_DERIVATION_PATH } from '@constants/index';
import { ContractCallOptions, makeUnsignedContractCall } from '@stacks/transactions';
import { selectPublicKey } from '@store/keys';
import { selectCoreNodeInfo, selectPoxInfo } from '@store/stacking';

interface UseCreateLedgerTxArgs {
  txOptions: ContractCallOptions;
  stacksApp: StacksApp;
}

export function useCreateLedgerTx() {
  const { publicKey, poxInfo, coreNodeInfo } = useSelector((state: RootState) => ({
    publicKey: selectPublicKey(state),
    poxInfo: selectPoxInfo(state),
    coreNodeInfo: selectCoreNodeInfo(state),
  }));

  const createLedgerContractCallTx = useCallback(
    async (args: UseCreateLedgerTxArgs) => {
      const { txOptions, stacksApp } = args;
      if (coreNodeInfo === null || !publicKey) throw new Error('Stacking requires coreNodeInfo');

      if (!poxInfo) throw new Error('`poxInfo` or `stacksApp` is not defined');

      const unsignedTx = await makeUnsignedContractCall({
        ...txOptions,
        publicKey: publicKey.toString('hex'),
      });

      const resp: ResponseSign = await stacksApp.sign(STX_DERIVATION_PATH, unsignedTx.serialize());

      if (resp.returnCode !== LedgerError.NoErrors) {
        throw new Error('Ledger responded with errors');
      }
      return unsignedTx.createTxWithSignature(resp.signatureVRS);
    },
    [coreNodeInfo, poxInfo, publicKey]
  );

  return { createLedgerContractCallTx };
}
