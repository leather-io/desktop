import React, { useCallback, useState } from 'react';
import {
  useCreateLedgerContractCallTx,
  useCreateLedgerTokenTransferTx,
} from '@hooks/use-create-ledger-contract-call-tx';
import { SignTxWithLedger } from '@modals/components/sign-tx-with-ledger';
import { LedgerConnectStep, usePrepareLedger } from '@hooks/use-prepare-ledger';
import { safeAwait } from '@utils/safe-await';
import { capitalize } from '@utils/capitalize';

import {
  StackingModalButton as Button,
  StackingModalFooter as Footer,
} from '../../modals/components/stacking-modal-layout';
import { SignTransactionProps } from './sign-transaction';

type SignTransactionLedgerProps = SignTransactionProps;

export const SignTransactionLedger = (props: SignTransactionLedgerProps) => {
  const { action, txOptions, isBroadcasting, onTransactionSigned, onClose } = props;

  const {
    step: ledgerStep,
    isLocked,
    isSupportedAppVersion,
    appVersionErrorText,
  } = usePrepareLedger();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { createLedgerContractCallTx } = useCreateLedgerContractCallTx();
  const { createLedgerTokenTransferTx } = useCreateLedgerTokenTransferTx();

  const createLedgerTx = useCallback(async () => {
    if ('recipient' in txOptions) {
      return createLedgerTokenTransferTx(txOptions);
    }
    return createLedgerContractCallTx(txOptions);
  }, [createLedgerContractCallTx, createLedgerTokenTransferTx, txOptions]);

  return (
    <>
      <SignTxWithLedger
        step={ledgerStep}
        isLocked={isLocked}
        ledgerError={isSupportedAppVersion ? null : appVersionErrorText}
      />
      <Footer>
        <Button mode="tertiary" onClick={onClose}>
          Close
        </Button>
        <Button
          isLoading={hasSubmitted || isBroadcasting}
          isDisabled={
            hasSubmitted ||
            ledgerStep !== LedgerConnectStep.ConnectedAppOpen ||
            isBroadcasting ||
            isLocked
          }
          onClick={async () => {
            setHasSubmitted(true);

            const [error, tx] = await safeAwait(createLedgerTx());
            if (error) {
              console.log(error);
              setHasSubmitted(false);
            }
            if (tx) onTransactionSigned(tx);
          }}
        >
          {capitalize(action)}
        </Button>
      </Footer>
    </>
  );
};
