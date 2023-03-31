/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  StackingModalButton as Button,
  StackingModalFooter as Footer,
} from '../../modals/components/stacking-modal-layout';
import { SignTransactionProps } from './sign-transaction';
import {
  useCreateLedgerContractCallTx,
  useCreateLedgerTokenTransferTx,
} from '@hooks/use-create-ledger-contract-call-tx';
import { LedgerConnectStep, usePrepareLedger } from '@hooks/use-prepare-ledger';
import { SignTxWithLedger } from '@modals/components/sign-tx-with-ledger';
import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';
import { capitalize } from '@utils/capitalize';
import { safeAwait } from '@utils/safe-await';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

type SignTransactionLedgerProps = SignTransactionProps;

export const SignTransactionLedger = (props: SignTransactionLedgerProps) => {
  const { action, txOptions, isBroadcasting, onTransactionSigned, onClose } = props;
  const [ledgerAddress, setLedgerAddress] = useState<null | string>(null);

  const {
    step: ledgerStep,
    isLocked,
    isSupportedAppVersion,
    appVersionErrorText,
    publicKeysDoNotMatchError,
  } = usePrepareLedger();

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { persistedAddress } = useSelector((state: RootState) => ({
    persistedAddress: selectAddress(state),
  }));
  const { createLedgerContractCallTx } = useCreateLedgerContractCallTx();
  const { createLedgerTokenTransferTx } = useCreateLedgerTokenTransferTx();

  const createLedgerTx = useCallback(async () => {
    const data = await main.ledger.showStxAddress();
    if (persistedAddress !== data.address) {
      setLedgerAddress(data.address);
    }
    if ('recipient' in txOptions) {
      return createLedgerTokenTransferTx(txOptions);
    }
    return createLedgerContractCallTx(txOptions);
  }, [createLedgerContractCallTx, createLedgerTokenTransferTx, persistedAddress, txOptions]);

  const ledgerError = useMemo(() => {
    if (!isSupportedAppVersion) return appVersionErrorText;
    if (ledgerAddress && persistedAddress !== ledgerAddress) return publicKeysDoNotMatchError;
    return null;
  }, [
    appVersionErrorText,
    isSupportedAppVersion,
    ledgerAddress,
    persistedAddress,
    publicKeysDoNotMatchError,
  ]);

  return (
    <>
      <SignTxWithLedger step={ledgerStep} isLocked={isLocked} ledgerError={ledgerError} />
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
