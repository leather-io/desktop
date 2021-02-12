import React, { FC, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@blockstack/ui';
import { useHistory } from 'react-router-dom';
import StacksApp from '@zondax/ledger-blockstack';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';
import { useHotkeys } from 'react-hotkeys-hook';
import { BigNumber } from 'bignumber.js';
import BN from 'bn.js';

import { RootState } from '@store/index';
import routes from '@constants/routes.json';

import { selectPoxInfo } from '@store/stacking';

import { broadcastTransaction, BroadcastTransactionArgs } from '@store/transaction';
import { selectAddressBalance } from '@store/address';
import { LedgerConnectStep } from '@hooks/use-ledger';
import { safeAwait } from '@utils/safe-await';

import {
  StackingModalHeader,
  StackingModalFooter,
  StackingModalButton,
  modalStyle,
} from '@modals/components/stacking-modal-layout';
import { DecryptWalletForm } from '@modals/components/decrypt-wallet-form';
import { StackingFailed } from '@modals/components/stacking-failed';

import { useWalletType } from '@hooks/use-wallet-type';
import { useStackingClient } from '@hooks/use-stacking-client';
import { SignTxWithLedger } from '@modals/components/sign-tx-with-ledger';
import { useApi } from '@hooks/use-api';
import { pendingTransactionSlice } from '@store/pending-transaction';
import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';
import { useDecryptWallet } from '@hooks/use-decrypt-wallet';
import { useCreateLedgerTx } from '@hooks/use-create-ledger-tx';
import { useCreateSoftwareTx } from '@hooks/use-create-software-tx';
import { delay } from '@utils/delay';

enum StackingModalStep {
  DecryptWalletAndSend,
  SignWithLedgerAndSend,
  FailedContractCall,
}

type StackingModalComponents = () => Record<'header' | 'body' | 'footer', JSX.Element>;

interface StackingModalProps {
  delegatorStxAddress: string;
  amountToStack: BigNumber;
  onClose(): void;
}

export const DelegatedStackingModal: FC<StackingModalProps> = props => {
  const { onClose, delegatorStxAddress, amountToStack } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  useHotkeys('esc', () => onClose());

  const [password, setPassword] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSendingTx, setIsSendingTx] = useState(false);

  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [stacksApp, setStacksApp] = useState<null | StacksApp>(null);

  const { walletType, whenWallet } = useWalletType();
  const { stackingClient } = useStackingClient();
  const { decryptWallet } = useDecryptWallet();
  const { createLedgerContractCallTx } = useCreateLedgerTx();
  const { createSoftwareTx } = useCreateSoftwareTx();

  const api = useApi();

  const { poxInfo, balance } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
    balance: selectAddressBalance(state),
  }));

  const initialStep = whenWallet({
    software: StackingModalStep.DecryptWalletAndSend,
    ledger: StackingModalStep.SignWithLedgerAndSend,
  });

  const [step, setStep] = useState(initialStep);

  const createDelegationTxOptions = useCallback(() => {
    if (!poxInfo) throw new Error('poxInfo not defined');
    return stackingClient.getDelegateOptions({
      amountMicroStx: new BN(amountToStack.toString()),
      contract: poxInfo.contract_id,
      delegateTo: delegatorStxAddress,
    });
  }, [amountToStack, delegatorStxAddress, poxInfo, stackingClient]);

  const createSoftwareWalletTx = useCallback(async () => {
    if (!password) throw new Error('`password` missing');
    const { privateKey } = await decryptWallet(password);
    const txOptions = createDelegationTxOptions();
    return createSoftwareTx({ privateKey, txOptions });
  }, [password, decryptWallet, createDelegationTxOptions, createSoftwareTx]);

  const createLedgerWalletTx = useCallback(async () => {
    if (!stacksApp || !poxInfo) throw new Error('`poxInfo` or `blockstackApp` is not defined');
    return createLedgerContractCallTx({
      txOptions: createDelegationTxOptions(),
      stacksApp: stacksApp,
    });
  }, [stacksApp, createDelegationTxOptions, createLedgerContractCallTx, poxInfo]);

  const broadcastTx = async () => {
    if (balance === null) return;
    setIsSendingTx(true);
    setHasSubmitted(true);

    const broadcastActions: Omit<BroadcastTransactionArgs, 'transaction'> = {
      onBroadcastSuccess: async txId => {
        const [, tx] = await safeAwait(watchForNewTxToAppear({ txId, nodeUrl: api.baseUrl }));
        if (tx) {
          dispatch(pendingTransactionSlice.actions.addPendingTransaction(tx as MempoolTransaction));
        }
        history.push(routes.HOME);
      },
      onBroadcastFail: () => setStep(StackingModalStep.FailedContractCall),
    };

    if (walletType === 'software') {
      setIsDecrypting(true);
      await delay(100);
      const [error, transaction] = await safeAwait(createSoftwareWalletTx());

      if (error) {
        setIsDecrypting(false);
        setIsSendingTx(false);
        setDecryptionError(
          String(error) === 'OperationError' ? 'Unable to decrypt wallet' : 'Something went wrong'
        );
        return;
      }
      if (transaction) {
        setIsDecrypting(false);
        dispatch(broadcastTransaction({ ...broadcastActions, transaction }));
      }
    }

    if (walletType === 'ledger') {
      const [error, transaction] = await safeAwait(createLedgerWalletTx());
      if (error) {
        setHasSubmitted(false);
        setIsSendingTx(false);
        setStep(StackingModalStep.FailedContractCall);
        return;
      }
      if (transaction) {
        dispatch(broadcastTransaction({ ...broadcastActions, transaction }));
      }
    }
  };

  const [ledgerConnectStep, setLedgerConnectStep] = useState(LedgerConnectStep.Disconnected);

  const setBlockstackAppCallback = useCallback(blockstackApp => setStacksApp(blockstackApp), []);
  const updateStep = useCallback(step => setLedgerConnectStep(step), []);

  const txFormStepMap: Record<StackingModalStep, StackingModalComponents> = {
    [StackingModalStep.DecryptWalletAndSend]: () => ({
      header: (
        <StackingModalHeader onSelectClose={onClose}>Confirm and delegate</StackingModalHeader>
      ),
      body: (
        <DecryptWalletForm
          description="Enter your password to initiate delegation"
          onSetPassword={password => setPassword(password)}
          onForgottenPassword={() => {
            onClose();
            history.push(routes.SETTINGS);
          }}
          hasSubmitted={hasSubmitted}
          decryptionError={decryptionError}
        />
      ),
      footer: (
        <StackingModalFooter>
          <StackingModalButton mode="tertiary" onClick={onClose}>
            Close
          </StackingModalButton>
          <StackingModalButton
            isLoading={isDecrypting || isSendingTx}
            isDisabled={isDecrypting || isSendingTx}
            onClick={() => broadcastTx()}
          >
            Initiate Delegation
          </StackingModalButton>
        </StackingModalFooter>
      ),
    }),
    [StackingModalStep.SignWithLedgerAndSend]: () => ({
      header: (
        <StackingModalHeader onSelectClose={onClose}>Confirm on your Ledger</StackingModalHeader>
      ),
      body: (
        <SignTxWithLedger
          onLedgerConnect={setBlockstackAppCallback}
          updateStep={updateStep}
          ledgerError={null}
        />
      ),
      footer: (
        <StackingModalFooter>
          <StackingModalButton
            mode="tertiary"
            onClick={() => {
              setHasSubmitted(false);
              onClose();
            }}
          >
            Close
          </StackingModalButton>
          <StackingModalButton
            isDisabled={
              stacksApp === null ||
              hasSubmitted ||
              ledgerConnectStep !== LedgerConnectStep.ConnectedAppOpen
            }
            isLoading={hasSubmitted}
            onClick={() => {
              if (stacksApp === null) return;
              void broadcastTx();
            }}
          >
            Sign transaction
          </StackingModalButton>
        </StackingModalFooter>
      ),
    }),

    [StackingModalStep.FailedContractCall]: () => ({
      header: <StackingModalHeader onSelectClose={onClose} />,
      body: (
        <StackingFailed walletType={walletType}>Failed to call stacking contract</StackingFailed>
      ),
      footer: (
        <StackingModalFooter>
          <StackingModalButton mode="tertiary" onClick={onClose}>
            Close
          </StackingModalButton>
          <StackingModalButton onClick={() => setStep(initialStep)}>Try again</StackingModalButton>
        </StackingModalFooter>
      ),
    }),
  };

  const { header, body, footer } = txFormStepMap[step]();

  return (
    <Modal isOpen headerComponent={header} footerComponent={footer} {...modalStyle}>
      {body}
    </Modal>
  );
};
