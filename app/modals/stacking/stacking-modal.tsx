import React, { FC, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Text, Flex, Modal, Spinner } from '@blockstack/ui';
import { useHistory } from 'react-router-dom';
import log from 'electron-log';
import BlockstackApp, { LedgerError, ResponseSign } from '@zondax/ledger-blockstack';
import { useHotkeys } from 'react-hotkeys-hook';
import { BigNumber } from 'bignumber.js';

import { RootState } from '@store/index';
import routes from '@constants/routes.json';
import {
  selectAddress,
  selectPublicKey,
  selectEncryptedMnemonic,
  selectSalt,
  decryptSoftwareWallet,
  selectWalletType,
} from '@store/keys';
import { LedgerConnectStep } from '@hooks/use-ledger';
import { safeAwait } from '@utils/safe-await';
import { homeActions } from '@store/home/home.reducer';

import { Pox } from '@utils/stacking/pox';

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
import { fetchStackerInfo, selectCoreNodeInfo, selectPoxInfo } from '@store/stacking';
import {
  makeUnsignedContractCall,
  StacksTransaction,
  makeContractCall,
  TransactionSigner,
  createStacksPrivateKey,
} from '@blockstack/stacks-transactions';
import { broadcastTransaction } from '@store/transaction';
import { selectActiveNodeApi } from '@store/stacks-node';
import { selectAddressBalance } from '@store/address';
import { Api } from '@api/api';
import { PendingContractCall } from './steps/pending-contract-call';

enum StackingModalStep {
  DecryptWalletAndSend,
  SignWithLedgerAndSend,
  PendingTransaction,
  StackingSuccess,
  FailedContractCall,
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

  const {
    encryptedMnemonic,
    salt,
    address,
    walletType,
    publicKey,
    poxInfo,
    node,
    coreNodeInfo,
    balance,
  } = useSelector((state: RootState) => ({
    salt: selectSalt(state),
    encryptedMnemonic: selectEncryptedMnemonic(state),
    address: selectAddress(state),
    walletType: selectWalletType(state),
    publicKey: selectPublicKey(state),
    poxInfo: selectPoxInfo(state),
    coreNodeInfo: selectCoreNodeInfo(state),
    node: selectActiveNodeApi(state),
    balance: selectAddressBalance(state),
  }));

  const initialStep =
    walletType === 'software'
      ? StackingModalStep.DecryptWalletAndSend
      : StackingModalStep.SignWithLedgerAndSend;

  const [step, setStep] = useState(initialStep);

  const createSoftwareWalletTx = useCallback(async (): Promise<StacksTransaction> => {
    if (!password || !encryptedMnemonic || !salt || !poxInfo || !balance) {
      throw new Error('One of `password`, `encryptedMnemonic` or `salt` is missing');
    }
    if (coreNodeInfo === null) throw new Error('Stacking requires coreNodeInfo');
    const poxClient = new Pox(node.url);
    const { privateKey } = await decryptSoftwareWallet({
      ciphertextMnemonic: encryptedMnemonic,
      salt,
      password,
    });
    const balanceBN = new BigNumber(balance, 10);
    const txOptions = poxClient.getLockTxOptions({
      cycles: numCycles,
      poxAddress,
      amountMicroStx: balanceBN,
      contract: poxInfo.contract_id,
      burnBlockHeight: coreNodeInfo.burn_block_height,
    });
    const tx = await makeContractCall({ ...txOptions, senderKey: privateKey });
    poxClient.modifyLockTxFee({ tx, amountMicroStx: balanceBN });
    const signer = new TransactionSigner(tx);
    signer.signOrigin(createStacksPrivateKey(privateKey));
    return tx;
  }, [
    password,
    encryptedMnemonic,
    salt,
    poxInfo,
    balance,
    coreNodeInfo,
    node.url,
    numCycles,
    poxAddress,
  ]);

  const createLedgerWalletTx = useCallback(
    async (options: { publicKey: Buffer }): Promise<StacksTransaction> => {
      if (coreNodeInfo === null) throw new Error('Stacking requires coreNodeInfo');
      const poxClient = new Pox(node.url);
      if (!blockstackApp || !poxInfo || !balance)
        throw new Error('`poxInfo` or `blockstackApp` is not defined');
      // 1. Form unsigned contract call transaction
      const balanceBN = new BigNumber(balance, 10);
      const txOptions = poxClient.getLockTxOptions({
        amountMicroStx: balanceBN,
        poxAddress,
        cycles: numCycles,
        contract: poxInfo.contract_id,
        burnBlockHeight: coreNodeInfo.burn_block_height,
      });

      const unsignedTx = await makeUnsignedContractCall({
        ...txOptions,
        publicKey: options.publicKey.toString('hex'),
      });

      poxClient.modifyLockTxFee({ tx: unsignedTx, amountMicroStx: balanceBN });

      // 2. Sign transaction
      const resp: ResponseSign = await blockstackApp.sign(
        `m/44'/5757'/0'/0/0`,
        unsignedTx.serialize()
      );
      if (resp.returnCode !== LedgerError.NoErrors) {
        throw new Error('Ledger responded with errors');
      }

      return unsignedTx.createTxWithSignature(resp.signatureVRS);
    },
    [coreNodeInfo, node.url, blockstackApp, poxInfo, balance, poxAddress, numCycles]
  );

  const closeModal = () => onClose();

  const checkPendingStackingCall = async (txId: string, interval: number) => {
    const [error, txResponse] = await safeAwait(new Api(node.url).getTxDetails(txId));
    if (error || !txResponse || txResponse.data.tx_status === 'pending') {
      return;
    }
    const tx = txResponse.data;
    clearInterval(interval);
    if (tx.tx_status === 'abort_by_response' || tx.tx_status === 'abort_by_post_condition') {
      setStep(StackingModalStep.FailedContractCall);
      return;
    }
    setStep(StackingModalStep.StackingSuccess);
    address && dispatch(fetchStackerInfo(address));
  };

  const broadcastTx = async () => {
    if (balance === null) return;

    const broadcastActions = {
      amount: new BigNumber(balance),
      onBroadcastSuccess: (txId: string) => {
        setStep(StackingModalStep.PendingTransaction);
        const interval: number = setInterval(
          () => void checkPendingStackingCall(txId, interval),
          1000
        );
      },
      onBroadcastFail: () => setStep(StackingModalStep.FailedContractCall),
    };

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
        dispatch(broadcastTransaction({ ...broadcastActions, transaction }));
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

    [StackingModalStep.PendingTransaction]: () => ({
      header: <StackingModalHeader onSelectClose={closeModal} />,
      body: <PendingContractCall />,
      footer: (
        <StackingModalFooter>
          <StackingModalButton onClick={() => (closeModal(), history.push(routes.HOME))}>
            Close
          </StackingModalButton>
        </StackingModalFooter>
      ),
    }),

    [StackingModalStep.StackingSuccess]: () => ({
      header: <StackingModalHeader onSelectClose={closeModal} />,
      body: <StackingSuccess cycles={numCycles} />,
      footer: (
        <StackingModalFooter>
          <StackingModalButton onClick={() => (closeModal(), history.push(routes.HOME))}>
            Close
          </StackingModalButton>
        </StackingModalFooter>
      ),
    }),

    [StackingModalStep.FailedContractCall]: () => ({
      header: <StackingModalHeader onSelectClose={closeModal} />,
      body: <FailedBroadcastError>Failed to call stacking contract</FailedBroadcastError>,
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
