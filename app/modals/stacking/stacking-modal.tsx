import React, { FC, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@blockstack/ui';
import { useHistory } from 'react-router-dom';
import BlockstackApp from '@zondax/ledger-blockstack';
import { useHotkeys } from 'react-hotkeys-hook';
import { BigNumber } from 'bignumber.js';
import BN from 'bn.js';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';

import { RootState } from '@store/index';

import routes from '@constants/routes.json';
import { selectPublicKey, selectWalletType } from '@store/keys';
import { activeStackingTx, selectCoreNodeInfo, selectPoxInfo } from '@store/stacking';
import { StacksTransaction } from '@stacks/transactions';
import { broadcastTransaction, BroadcastTransactionArgs } from '@store/transaction';
import { selectAddressBalance } from '@store/address';
import { LedgerConnectStep } from '@hooks/use-ledger';
import { useDecryptWallet } from '@hooks/use-decrypt-wallet';
import { useStackingClient } from '@hooks/use-stacking-client';
import { useApi } from '@hooks/use-api';
import { useCreateLedgerTx } from '@hooks/use-create-ledger-tx';
import { useCreateSoftwareTx } from '@hooks/use-create-software-tx';
import { safeAwait } from '@utils/safe-await';

import {
  StackingModalHeader,
  StackingModalFooter,
  StackingModalButton,
  modalStyle,
} from '../components/stacking-modal-layout';
import { DecryptWalletForm } from '../components/decrypt-wallet-form';

import { delay } from '@utils/delay';
import { StackingFailed } from '@modals/components/stacking-failed';
import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';
import { pendingTransactionSlice } from '@store/pending-transaction';
import { SignTxWithLedger } from '../components/sign-tx-with-ledger';

enum StackingModalStep {
  DecryptWalletAndSend,
  SignWithLedgerAndSend,
  FailedContractCall,
}

type StackingModalComponents = () => Record<'header' | 'body' | 'footer', JSX.Element>;

interface StackingModalProps {
  poxAddress: string;
  numCycles: number;
  amountToStack: BigNumber;
  onClose(): void;
}

export const StackingModal: FC<StackingModalProps> = props => {
  const { onClose, numCycles, poxAddress, amountToStack } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  useHotkeys('esc', () => onClose());

  const [password, setPassword] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSendingTx, setIsSendingTx] = useState(false);

  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [blockstackApp, setBlockstackApp] = useState<null | BlockstackApp>(null);

  const { stackingClient } = useStackingClient();
  const { decryptWallet } = useDecryptWallet();
  const { createLedgerContractCallTx } = useCreateLedgerTx();
  const { createSoftwareTx } = useCreateSoftwareTx();
  const api = useApi();

  const { walletType, publicKey, poxInfo, coreNodeInfo, balance } = useSelector(
    (state: RootState) => ({
      walletType: selectWalletType(state),
      publicKey: selectPublicKey(state),
      poxInfo: selectPoxInfo(state),
      coreNodeInfo: selectCoreNodeInfo(state),
      balance: selectAddressBalance(state),
    })
  );

  const initialStep =
    walletType === 'software'
      ? StackingModalStep.DecryptWalletAndSend
      : StackingModalStep.SignWithLedgerAndSend;

  const [step, setStep] = useState(initialStep);

  const createStackingTxOptions = useCallback(() => {
    if (!poxInfo) throw new Error('poxInfo not defined');
    if (!coreNodeInfo) throw new Error('Stacking requires coreNodeInfo');
    return stackingClient.getStackOptions({
      amountMicroStx: new BN(amountToStack.toString()),
      poxAddress,
      cycles: numCycles,
      contract: poxInfo.contract_id,
      burnBlockHeight: coreNodeInfo.burn_block_height,
    });
  }, [amountToStack, coreNodeInfo, numCycles, poxAddress, poxInfo, stackingClient]);

  const createSoftwareWalletTx = useCallback(async (): Promise<StacksTransaction> => {
    if (!password || !poxInfo || !balance) {
      throw new Error('One of `password`, `encryptedMnemonic` or `salt` is missing');
    }
    if (coreNodeInfo === null) throw new Error('Stacking requires coreNodeInfo');
    const { privateKey } = await decryptWallet(password);
    const txOptions = createStackingTxOptions();
    return createSoftwareTx({ txOptions, privateKey });
  }, [
    balance,
    coreNodeInfo,
    createSoftwareTx,
    createStackingTxOptions,
    decryptWallet,
    password,
    poxInfo,
  ]);

  const createLedgerWalletTx = useCallback(async (): Promise<StacksTransaction> => {
    if (coreNodeInfo === null) throw new Error('Stacking requires coreNodeInfo');
    if (!blockstackApp) throw new Error('``blockstackApp` is not defined');

    const txOptions = createStackingTxOptions();
    return createLedgerContractCallTx({ stacksApp: blockstackApp, txOptions });
  }, [blockstackApp, coreNodeInfo, createLedgerContractCallTx, createStackingTxOptions]);

  const broadcastTx = async () => {
    if (balance === null) return;
    setIsSendingTx(true);
    setHasSubmitted(true);

    const broadcastActions: Omit<BroadcastTransactionArgs, 'transaction'> = {
      onBroadcastSuccess: async txId => {
        dispatch(activeStackingTx({ txId }));
        const tx = await watchForNewTxToAppear({ txId, nodeUrl: api.baseUrl });
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
        setIsSendingTx(false);
        setIsDecrypting(false);
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
        setStep(StackingModalStep.FailedContractCall);
        return;
      }
      if (transaction) {
        dispatch(broadcastTransaction({ ...broadcastActions, transaction }));
      }
    }
  };

  const [ledgerConnectStep, setLedgerConnectStep] = useState(LedgerConnectStep.Disconnected);

  const setBlockstackAppCallback = useCallback(
    blockstackApp => setBlockstackApp(blockstackApp),
    []
  );
  const updateStep = useCallback(step => setLedgerConnectStep(step), []);

  const txFormStepMap: Record<StackingModalStep, StackingModalComponents> = {
    [StackingModalStep.DecryptWalletAndSend]: () => ({
      header: <StackingModalHeader onSelectClose={onClose}>Confirm and lock</StackingModalHeader>,
      body: (
        <DecryptWalletForm
          description="Enter your password to initiate Stacking"
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
            Initiate Stacking
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
              blockstackApp === null ||
              hasSubmitted ||
              ledgerConnectStep !== LedgerConnectStep.ConnectedAppOpen
            }
            isLoading={hasSubmitted}
            onClick={() => {
              if (blockstackApp === null) return;
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
