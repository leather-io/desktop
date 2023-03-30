/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { LedgerError } from '@zondax/ledger-blockstack';
import { bytesToHex } from '@stacks/common';

import { RootState } from '@store/index';
import {
  ContractCallOptions,
  createMessageSignature,
  deserializeTransaction,
  makeUnsignedContractCall,
  makeUnsignedSTXTokenTransfer,
  SingleSigSpendingCondition,
  TokenTransferOptions,
} from '@stacks/transactions';
import { selectPublicKey } from '@store/keys';
import { selectCoreNodeInfo, selectPoxInfo } from '@store/stacking';

function signTransactionWithSignature(transaction: string, signatureVRS: string) {
  const deserialzedTx = deserializeTransaction(transaction);
  const spendingCondition = createMessageSignature(signatureVRS);
  (deserialzedTx.auth.spendingCondition as SingleSigSpendingCondition).signature =
    spendingCondition;
  return deserialzedTx;
}

function useCreateLedgerTxFactory(
  method: typeof makeUnsignedContractCall | typeof makeUnsignedSTXTokenTransfer
) {
  const { publicKey, poxInfo, coreNodeInfo } = useSelector((state: RootState) => ({
    publicKey: selectPublicKey(state),
    poxInfo: selectPoxInfo(state),
    coreNodeInfo: selectCoreNodeInfo(state),
  }));

  return useCallback(
    async (options: TokenTransferOptions | ContractCallOptions) => {
      if (coreNodeInfo === null || !publicKey) throw new Error('Stacking requires coreNodeInfo');

      if (!poxInfo) throw new Error('`poxInfo` or `stacksApp` is not defined');

      console.log({ publicKey: publicKey.toString('hex') });

      const unsignedTx = await method({
        ...options,
        publicKey: publicKey.toString('hex'),
      } as any);

      const resp = await main.ledger.signTransaction(bytesToHex(unsignedTx.serialize()));

      if (resp.returnCode !== LedgerError.NoErrors) {
        throw new Error('Ledger responded with errors');
      }
      console.log('xxxxxxxxx', resp);
      return signTransactionWithSignature(
        bytesToHex(unsignedTx.serialize()),
        resp.signatureVRS as unknown as string
      );
    },
    [coreNodeInfo, method, poxInfo, publicKey]
  );
}

export function useCreateLedgerContractCallTx() {
  const method = useCreateLedgerTxFactory(makeUnsignedContractCall);
  const createLedgerContractCallTx = useCallback(method, [method]);

  return { createLedgerContractCallTx };
}

export function useCreateLedgerTokenTransferTx() {
  const method = useCreateLedgerTxFactory(makeUnsignedSTXTokenTransfer);
  const createLedgerTokenTransferTx = useCallback(method, [method]);

  return { createLedgerTokenTransferTx };
}
