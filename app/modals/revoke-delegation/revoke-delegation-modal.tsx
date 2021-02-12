import React, { FC, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@blockstack/ui';
import { useHistory } from 'react-router-dom';
import StacksApp from '@zondax/ledger-blockstack';
import { useHotkeys } from 'react-hotkeys-hook';

import { RootState } from '@store/index';

import routes from '@constants/routes.json';
import { selectPublicKey } from '@store/keys';
import { selectCoreNodeInfo, selectPoxInfo } from '@store/stacking';
import { broadcastTransaction, BroadcastTransactionArgs } from '@store/transaction';
import { selectAddressBalance } from '@store/address';
import { useWalletType } from '@hooks/use-wallet-type';
import { LedgerConnectStep } from '@hooks/use-ledger';
import { safeAwait } from '@utils/safe-await';
import { delay } from '@utils/delay';
import { homeActions } from '@store/home';
import { useStackingClient } from '@hooks/use-stacking-client';
import { useApi } from '@hooks/use-api';
import { SignTxWithLedger } from '@modals/components/sign-tx-with-ledger';
import { StackingFailed } from '@modals/components/stacking-failed';

import {
  StackingModalHeader,
  StackingModalFooter,
  StackingModalButton,
  modalStyle,
} from '../components/stacking-modal-layout';
import { DecryptWalletForm } from '../components/decrypt-wallet-form';
import { pendingTransactionSlice } from '@store/pending-transaction';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';
import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';
import { useDecryptWallet } from '@hooks/use-decrypt-wallet';
import { useCreateLedgerTx } from '@hooks/use-create-ledger-tx';
import { useCreateSoftwareTx } from '@hooks/use-create-software-tx';

enum RevokeDelegationModalStep {
  DecryptWalletAndSend,
  SignWithLedgerAndSend,
  FailedContractCall,
}

type StackingModalComponents = () => Record<'header' | 'body' | 'footer', JSX.Element>;

export const RevokeDelegationModal: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  useHotkeys('esc', () => void dispatch(homeActions.closeRevokeDelegationModal()));
  const closeModal = () => dispatch(homeActions.closeRevokeDelegationModal());
  const api = useApi();

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

  const { publicKey, poxInfo, coreNodeInfo, balance } = useSelector((state: RootState) => ({
    publicKey: selectPublicKey(state),
    poxInfo: selectPoxInfo(state),
    coreNodeInfo: selectCoreNodeInfo(state),
    balance: selectAddressBalance(state),
  }));

  const initialStep = whenWallet({
    software: RevokeDelegationModalStep.DecryptWalletAndSend,
    ledger: RevokeDelegationModalStep.SignWithLedgerAndSend,
  });

  const [step, setStep] = useState(initialStep);

  const createRevocationTxOptions = useCallback(() => {
    if (!poxInfo) throw new Error('Requires pox info');
    return stackingClient.getRevokeDelegateStxOptions(poxInfo.contract_id);
  }, [poxInfo, stackingClient]);

  const createSoftwareWalletTx = useCallback(async () => {
    if (!password) throw new Error('Password not set');
    if (coreNodeInfo === null) throw new Error('Stacking requires coreNodeInfo');
    const { privateKey } = await decryptWallet(password);
    const txOptions = createRevocationTxOptions();
    return createSoftwareTx({ privateKey, txOptions });
  }, [password, coreNodeInfo, decryptWallet, createRevocationTxOptions, createSoftwareTx]);

  const createLedgerWalletTx = useCallback(async () => {
    if (!stacksApp) throw new Error('`blockstackApp` is not defined');
    return createLedgerContractCallTx({
      txOptions: createRevocationTxOptions(),
      stacksApp: stacksApp,
    });
  }, [stacksApp, createLedgerContractCallTx, createRevocationTxOptions]);

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
        dispatch(homeActions.closeRevokeDelegationModal());
      },
      onBroadcastFail: () => setStep(RevokeDelegationModalStep.FailedContractCall),
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
      if (publicKey === null) {
        return;
      }
      const [error, transaction] = await safeAwait(createLedgerWalletTx());

      if (error) {
        setHasSubmitted(false);
        setIsSendingTx(false);
        setStep(RevokeDelegationModalStep.FailedContractCall);
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

  const txFormStepMap: Record<RevokeDelegationModalStep, StackingModalComponents> = {
    [RevokeDelegationModalStep.DecryptWalletAndSend]: () => ({
      header: (
        <StackingModalHeader onSelectClose={closeModal}>
          Confirm and revoke delegation
        </StackingModalHeader>
      ),
      body: (
        <DecryptWalletForm
          description="Enter your password to revoke delegation"
          onSetPassword={password => setPassword(password)}
          onForgottenPassword={() => {
            closeModal();
            history.push(routes.SETTINGS);
          }}
          hasSubmitted={hasSubmitted}
          decryptionError={decryptionError}
        />
      ),
      footer: (
        <StackingModalFooter>
          <StackingModalButton mode="tertiary" onClick={closeModal}>
            Close
          </StackingModalButton>
          <StackingModalButton
            isLoading={isDecrypting || isSendingTx}
            isDisabled={isDecrypting || isSendingTx}
            onClick={() => broadcastTx()}
          >
            Revoke Delegation
          </StackingModalButton>
        </StackingModalFooter>
      ),
    }),
    [RevokeDelegationModalStep.SignWithLedgerAndSend]: () => ({
      header: (
        <StackingModalHeader onSelectClose={closeModal}>Confirm on your Ledger</StackingModalHeader>
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
              closeModal();
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

    [RevokeDelegationModalStep.FailedContractCall]: () => ({
      header: <StackingModalHeader onSelectClose={closeModal} />,
      body: (
        <StackingFailed walletType={walletType}>Failed to call stacking contract</StackingFailed>
      ),
      footer: (
        <StackingModalFooter>
          <StackingModalButton mode="tertiary" onClick={closeModal}>
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
