import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@store/index';
import {
  ContractCallOptions,
  makeContractCall,
  TransactionSigner,
  createStacksPrivateKey,
} from '@stacks/transactions';
import { selectCoreNodeInfo, selectPoxInfo } from '@store/stacking';

interface UseCreateSoftwareTxArgs {
  txOptions: ContractCallOptions;
  privateKey: string;
}

export function useCreateSoftwareTx() {
  const { poxInfo, coreNodeInfo } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
    coreNodeInfo: selectCoreNodeInfo(state),
  }));

  const createSoftwareTx = useCallback(
    async (args: UseCreateSoftwareTxArgs) => {
      const { txOptions, privateKey } = args;
      if (!coreNodeInfo) throw new Error('Stacking requires coreNodeInfo');
      if (!poxInfo) throw new Error('`poxInfo` or `blockstackApp` is not defined');
      const tx = await makeContractCall({ ...txOptions, senderKey: privateKey });
      const signer = new TransactionSigner(tx);
      signer.signOrigin(createStacksPrivateKey(privateKey));
      return tx;
    },
    [coreNodeInfo, poxInfo]
  );

  return { createSoftwareTx };
}
