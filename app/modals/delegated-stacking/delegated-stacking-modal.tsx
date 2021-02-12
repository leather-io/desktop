import React, { FC, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@blockstack/ui';
import { useHistory } from 'react-router-dom';
import BlockstackApp, { LedgerError, ResponseSign } from '@zondax/ledger-blockstack';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';
import { useHotkeys } from 'react-hotkeys-hook';
import { BigNumber } from 'bignumber.js';
import BN from 'bn.js';

import { RootState } from '@store/index';
import { STX_DERIVATION_PATH } from '@constants/index';
import routes from '@constants/routes.json';
import { selectPublicKey } from '@store/keys';
import { selectCoreNodeInfo, selectPoxInfo } from '@store/stacking';
import {
  makeUnsignedContractCall,
  StacksTransaction,
  makeContractCall,
  TransactionSigner,
  createStacksPrivateKey,
} from '@stacks/transactions';
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
import { delay } from '@utils/delay';

import { useWalletType } from '@hooks/use-wallet-type';
import { useStackingClient } from '@hooks/use-stacking-client';
import { SignTxWithLedger } from '@modals/components/sign-tx-with-ledger';
import { useApi } from '@hooks/use-api';
import { pendingTransactionSlice } from '@store/pending-transaction';
import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';
import { useDecryptWallet } from '@hooks/use-decrypt-wallet';

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
  const [blockstackApp, setBlockstackApp] = useState<null | BlockstackApp>(null);

  const { walletType, whenWallet } = useWalletType();
  const { stackingClient } = useStackingClient();
  const { decryptWallet } = useDecryptWallet();

  const api = useApi();

  const { publicKey, poxInfo, coreNodeInfo, balance } = useSelector((state: RootState) => ({
    publicKey: selectPublicKey(state),
    poxInfo: selectPoxInfo(state),
    coreNodeInfo: selectCoreNodeInfo(state),
    balance: selectAddressBalance(state),
  }));

  const initialStep = whenWallet({
    software: StackingModalStep.DecryptWalletAndSend,
    ledger: StackingModalStep.SignWithLedgerAndSend,
  });

  const [step, setStep] = useState(initialStep);

  const createSoftwareWalletTx = useCallback(async (): Promise<StacksTransaction> => {
    if (!password || !poxInfo || !balance) {
      throw new Error('One of `password`, `encryptedMnemonic` or `salt` is missing');
    }
    if (coreNodeInfo === null) throw new Error('Stacking requires coreNodeInfo');

    const { privateKey } = await decryptWallet(password);
    const txOptions = stackingClient.getDelegateOptions({
      amountMicroStx: new BN(amountToStack.toString()),
      contract: poxInfo.contract_id,
      delegateTo: delegatorStxAddress,
    });
    const tx = await makeContractCall({ ...txOptions, senderKey: privateKey });
    const signer = new TransactionSigner(tx);
    signer.signOrigin(createStacksPrivateKey(privateKey));
    return tx;
  }, [
    password,
    poxInfo,
    balance,
    coreNodeInfo,
    decryptWallet,
    stackingClient,
    amountToStack,
    delegatorStxAddress,
  ]);

  const createLedgerWalletTx = useCallback(
    async (options: { publicKey: Buffer }): Promise<StacksTransaction> => {
      if (coreNodeInfo === null) throw new Error('Stacking requires coreNodeInfo');
      if (!blockstackApp || !poxInfo || !balance)
        throw new Error('`poxInfo` or `blockstackApp` is not defined');

      const txOptions = stackingClient.getDelegateOptions({
        amountMicroStx: new BN(amountToStack.toString()),
        delegateTo: delegatorStxAddress,
        contract: poxInfo.contract_id,
      });

      const unsignedTx = await makeUnsignedContractCall({
        ...txOptions,
        publicKey: options.publicKey.toString('hex'),
      });

      const resp: ResponseSign = await blockstackApp.sign(
        STX_DERIVATION_PATH,
        unsignedTx.serialize()
      );
      if (resp.returnCode !== LedgerError.NoErrors) {
        throw new Error('Ledger responded with errors');
      }
      return unsignedTx.createTxWithSignature(resp.signatureVRS);
    },
    [
      coreNodeInfo,
      blockstackApp,
      poxInfo,
      balance,
      stackingClient,
      amountToStack,
      delegatorStxAddress,
    ]
  );

  const broadcastTx = async () => {
    if (balance === null) return;
    setIsSendingTx(true);

    const broadcastActions: Omit<BroadcastTransactionArgs, 'transaction'> = {
      onBroadcastSuccess: async txId => {
        const tx = await watchForNewTxToAppear({ txId, nodeUrl: api.baseUrl });
        if (tx) {
          dispatch(pendingTransactionSlice.actions.addPendingTransaction(tx as MempoolTransaction));
        }
        history.push(routes.HOME);
      },
      onBroadcastFail: () => setStep(StackingModalStep.FailedContractCall),
    };

    setHasSubmitted(true);
    await delay(200);

    if (walletType === 'software') {
      setIsDecrypting(true);

      const [error, transaction] = await safeAwait(createSoftwareWalletTx());

      if (error) {
        setIsDecrypting(false);
        setIsSendingTx(false);
        setDecryptionError(
          String(error) === 'OperationError'
            ? 'Unable to decrypt wallet'
            : 'Something else went wrong'
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

      const [error, transaction] = await safeAwait(createLedgerWalletTx({ publicKey }));

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
