import React, { FC, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@blockstack/ui';
import { useHistory } from 'react-router-dom';
import log from 'electron-log';
import BlockstackApp, { LedgerError, ResponseSign } from '@zondax/ledger-blockstack';
import { useHotkeys } from 'react-hotkeys-hook';
import { BigNumber } from 'bignumber.js';

import { RootState } from '@store/index';
import routes from '@constants/routes.json';
import { selectPublicKey } from '@store/keys/keys.reducer';
import { LedgerConnectStep } from '@hooks/use-ledger';
import { safeAwait } from '@utils/safe-await';
import { homeActions } from '@store/home/home.reducer';
import {
  selectEncryptedMnemonic,
  selectSalt,
  decryptSoftwareWallet,
  selectWalletType,
} from '@store/keys';
import { POX } from '@utils/stacking/pox';

import {
  StackingModalHeader,
  StackingModalFooter,
  StackingModalButton,
  modalStyle,
} from './stacking-modal-layout';
import { DecryptWalletForm } from './steps/decrypt-wallet-form';
import { SignTxWithLedger } from './steps/sign-tx-with-ledger';
import { FailedBroadcastError } from './steps/failed-broadcast-error';
import { StackingSuccess } from './steps/stacking-success';
import { selectPoxInfo } from '@store/stacking';
import {
  makeUnsignedContractCall,
  StacksTransaction,
  makeContractCall,
} from '@blockstack/stacks-transactions';
import { createMessageSignature } from '@blockstack/stacks-transactions/lib/authorization';
import { broadcastStxTransaction } from '@store/transaction';
import { selectActiveNodeApi } from '@store/stacks-node';

enum StackingModalStep {
  DecryptWalletAndSend,
  SignWithLedgerAndSend,
  StackingSuccess,
  NetworkError,
}

type ModalComponents = () => Record<'header' | 'body' | 'footer', JSX.Element>;

interface StackingModalProps {
  onClose(): void;
  poxAddress: string;
  numCycles: number;
}

export const StackingModal: FC<StackingModalProps> = ({ onClose, numCycles, poxAddress }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  useHotkeys('esc', () => void dispatch(homeActions.closeTxModal()));

  const [password, setPassword] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [blockstackApp, setBlockstackApp] = useState<null | BlockstackApp>(null);

  const { encryptedMnemonic, salt, walletType, publicKey, poxInfo, nodeURL: node } = useSelector(
    (state: RootState) => ({
      salt: selectSalt(state),
      encryptedMnemonic: selectEncryptedMnemonic(state),
      walletType: selectWalletType(state),
      publicKey: selectPublicKey(state),
      poxInfo: selectPoxInfo(state),
      nodeURL: selectActiveNodeApi(state),
    })
  );

  const initialStep =
    walletType === 'software'
      ? StackingModalStep.DecryptWalletAndSend
      : StackingModalStep.SignWithLedgerAndSend;
  const [step, setStep] = useState(initialStep);

  const createSoftwareWalletTx = useCallback(async (): Promise<StacksTransaction> => {
    if (!password || !encryptedMnemonic || !salt || !poxInfo) {
      throw new Error('One of `password`, `encryptedMnemonic` or `salt` is missing');
    }
    const poxClient = new POX(node.url);
    const { privateKey } = await decryptSoftwareWallet({
      ciphertextMnemonic: encryptedMnemonic,
      salt,
      password,
    });
    const txOptions = await poxClient.getLockTxOptions({
      cycles: numCycles,
      poxAddress,
      amountMicroSTX: poxInfo.min_amount_ustx,
    });
    const tx = await makeContractCall({
      ...txOptions,
      senderKey: privateKey,
    });
    return tx;
  }, [encryptedMnemonic, password, salt, numCycles, poxInfo, poxAddress, node.url]);

  const createLedgerWalletTx = useCallback(
    async (options: { publicKey: Buffer }): Promise<StacksTransaction> => {
      const poxClient = new POX(node.url);
      if (!blockstackApp || !poxInfo)
        throw new Error('`poxInfo` or `blockstackApp` is not defined');
      // 1. Form unsigned contract call transaction
      const txOptions = await poxClient.getLockTxOptions({
        amountMicroSTX: poxInfo.min_amount_ustx,
        poxAddress,
        cycles: numCycles,
      });

      const unsignedTx = await makeUnsignedContractCall({
        ...txOptions,
        publicKey: options.publicKey.toString('hex'),
      });

      // 2. Sign transaction
      const resp: ResponseSign = await blockstackApp.sign(
        `m/44'/5757'/0'/0/0`,
        unsignedTx.serialize()
      );
      if (resp.returnCode !== LedgerError.NoErrors) {
        throw new Error('Ledger responded with errors');
      }

      unsignedTx.createTxWithSignature(resp.signatureVRS);

      return unsignedTx;
    },
    [blockstackApp, poxInfo, numCycles, poxAddress, node.url]
  );

  const closeModal = () => onClose();

  const broadcastActions = {
    amount: new BigNumber(0),
    onBroadcastSuccess: closeModal,
    onBroadcastFail: () => setStep(StackingModalStep.NetworkError),
  };

  const broadcastTx = async () => {
    setHasSubmitted(true);
    if (walletType === 'software') {
      setIsDecrypting(true);

      const [error, transaction] = await safeAwait(createSoftwareWalletTx());

      if (error) {
        setIsDecrypting(false);
        setDecryptionError('Unable to decrypt wallet');
        return;
      }

      if (transaction) {
        setIsDecrypting(false);
        dispatch(broadcastStxTransaction({ ...broadcastActions, transaction }));
      }
    }

    if (walletType === 'ledger') {
      if (publicKey === null) {
        log.error('Tried to create Ledger transaction without persisted private key');
        return;
      }

      const [error, transaction] = await safeAwait(createLedgerWalletTx({ publicKey }));

      if (error) {
        setHasSubmitted(false);
        return;
      }

      if (transaction) {
        dispatch(broadcastStxTransaction({ ...broadcastActions, transaction }));
      }
    }
  };

  const [ledgerConnectStep, setLedgerConnectStep] = useState(LedgerConnectStep.Disconnected);

  const setBlockstackAppCallback = useCallback(
    blockstackApp => setBlockstackApp(blockstackApp),
    []
  );
  const updateStep = useCallback(step => setLedgerConnectStep(step), []);

  const txFormStepMap: Record<StackingModalStep, ModalComponents> = {
    [StackingModalStep.DecryptWalletAndSend]: () => ({
      header: (
        <StackingModalHeader onSelectClose={closeModal}>Confirm and lock</StackingModalHeader>
      ),
      body: (
        <DecryptWalletForm
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
          <StackingModalButton mode="tertiary" onClick={() => closeModal()}>
            Close
          </StackingModalButton>
          <StackingModalButton
            isLoading={isDecrypting}
            isDisabled={isDecrypting}
            onClick={() => broadcastTx()}
          >
            Send transaction
          </StackingModalButton>
        </StackingModalFooter>
      ),
    }),
    [StackingModalStep.SignWithLedgerAndSend]: () => ({
      header: (
        <StackingModalHeader onSelectClose={closeModal}>Confirm on your Ledger</StackingModalHeader>
      ),
      body: <SignTxWithLedger onLedgerConnect={setBlockstackAppCallback} updateStep={updateStep} />,
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

    [StackingModalStep.StackingSuccess]: () => ({
      header: <StackingModalHeader onSelectClose={closeModal} />,
      body: <StackingSuccess />,
      footer: (
        <StackingModalFooter>
          <StackingModalButton onClick={closeModal}>Close</StackingModalButton>
        </StackingModalFooter>
      ),
    }),

    [StackingModalStep.NetworkError]: () => ({
      header: <StackingModalHeader onSelectClose={closeModal} />,
      body: <FailedBroadcastError />,
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
