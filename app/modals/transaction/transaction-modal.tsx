import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BN from 'bn.js';
import { BigNumber } from 'bignumber.js';
import { Modal, Text, Button, Box, Input, useForceUpdate } from '@blockstack/ui';
import { StacksTransaction, makeSTXTokenTransfer } from '@blockstack/stacks-transactions';
import { useHotkeys } from 'react-hotkeys-hook';

import { RootState } from '../../store';
import { validateStacksAddress } from '../../utils/get-stx-transfer-direction';

import { selectTxModalOpen, homeActions } from '../../store/home/home.reducer';
import { TxModalForm } from './transaction-form';
import {
  selectMnemonic,
  decryptWallet,
  selectDecryptionError,
  selectIsDecrypting,
  selectEncryptedMnemonic,
  selectSalt,
} from '../../store/keys';
import {
  TxModalHeader,
  buttonStyle,
  TxModalFooter,
  TxModalPreview,
  TxModalPreviewItem,
  modalStyle,
} from './transaction-modal-layout';
import { createStxTransaction } from '../../crypto/create-stx-tx';
import { validateAddressChain } from '../../crypto/validate-address-net';
import { broadcastStxTransaction } from '../../store/transaction';
import { toHumanReadableStx, stxToMicroStx } from '../../utils/unit-convert';
import { ErrorLabel } from '../../components/error-label';
import { ErrorText } from '../../components/error-text';
import { stacksNetwork } from '../../environment';
import { DecryptWalletForm } from './decrypt-wallet-form';
import { deriveRootKeychainFromMnemonic } from '@blockstack/keychain';
import { deriveStxAddressKeychain } from '../../crypto/derive-address-keychain';
import { deriveKey } from '../../crypto/key-generation';
import { safeAwait } from '../../utils/safe-await';
import { decryptMnemonic } from '../../crypto/key-encryption';

interface TxModalProps {
  balance: string;
  address: string;
}

enum TxModalStep {
  DescribeTx,
  PreviewTx,
  ConfirmAndSend,
}

type ModalComponents = () => {
  [component in 'header' | 'body' | 'footer']: JSX.Element;
};

export const TransactionModal: FC<TxModalProps> = ({ balance, address }) => {
  const dispatch = useDispatch();
  useHotkeys('esc', () => void dispatch(homeActions.closeTxModal()));
  const [step, setStep] = useState(TxModalStep.DescribeTx);
  const [fee, setFee] = useState(new BN(0));
  const [amount, setAmount] = useState(new BigNumber(0));
  const [password, setPassword] = useState('');
  const [total, setTotal] = useState(new BigNumber(0));
  // const [tx, setTx] = useState<null | StacksTransaction>(null);
  const [loading, setLoading] = useState(false);
  const { txModalOpen, decryptionError, isDecrypting, encryptedMnemonic, salt } = useSelector(
    (state: RootState) => ({
      txModalOpen: selectTxModalOpen(state),
      decryptionError: selectDecryptionError(state),
      isDecrypting: selectIsDecrypting(state),
      salt: selectSalt(state),
      encryptedMnemonic: selectEncryptedMnemonic(state),
    })
  );
  const forceUpdate = useForceUpdate();

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const handlePasswordInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pass = e.currentTarget.value;
    setPassword(pass);
  };

  const broadcastTx = async () => {
    if (!password) return;
    setHasSubmitted(true);
    dispatch(decryptWallet({ password, onDecryptSuccess: () => ({}) }));
    // forceUpdate();

    if (!encryptedMnemonic || !salt) {
      console.log('there is no encrypted mnemonic or salt');
      return;
    }
    console.log(encryptedMnemonic);
    const { derivedKeyHash } = await deriveKey({ pass: password, salt });

    const [error, mnemonic] = await safeAwait(
      decryptMnemonic({ encryptedMnemonic, derivedKeyHash })
    );
    if (error) {
      console.log('there an error with decrypting mnemonic');
      return;
    }

    if (mnemonic) {
      const rootNode = await deriveRootKeychainFromMnemonic(mnemonic);
      const { privateKey } = deriveStxAddressKeychain(rootNode);
      const tx = await makeSTXTokenTransfer({
        recipient: form.values.recipient,
        network: stacksNetwork,
        amount: new BN(stxToMicroStx(form.values.amount).toString()),
        senderKey: privateKey,
      });

      dispatch(
        broadcastStxTransaction({ signedTx: tx, amount, onBroadcastSuccess: closeModalResetForm })
      );
    }
  };

  const totalIsMoreThanBalance = total.isGreaterThan(balance);

  const form = useFormik({
    initialValues: {
      recipient: '',
      amount: '',
    },
    validationSchema: yup.object().shape({
      recipient: yup
        .string()
        .test('test-is-stx-address', 'Must be a valid Stacks Address', (value = '') =>
          validateStacksAddress(value)
        )
        .test('test-is-for-valid-chain', 'Address is for incorrect network', (value = '') =>
          validateAddressChain(value)
        )
        .test(
          'test-is-not-my-address',
          'You cannot send Stacks to yourself',
          value => value !== address
        ),
      amount: yup
        .number()
        .typeError('Amount of STX must be described as number')
        .positive('You cannot send a negative amount of STX')
        .test(
          'test-has-less-than-or-equal-to-6-decimal-places',
          'STX do not have more than 6 decimal places',
          (value: number) => {
            // Explicit base ensures BigNumber doesn't use exponential notation
            const decimals = new BigNumber(value).toString(10).split('.')[1];
            return decimals === undefined || decimals.length <= 6;
          }
        )
        .test(
          'test-address-has-enough-balance',
          'Cannot send more STX than available balance',
          (value: number) => {
            // If there's no input, pass this test,
            // otherwise it'll render the error for this test
            if (value === undefined) return true;
            const enteredAmount = stxToMicroStx(value);
            return enteredAmount.isLessThanOrEqualTo(balance);
          }
        )
        .required(),
    }),
    onSubmit: async () => {
      // if (!mnemonic) return;
      setLoading(true);
      // const tx = await createStxTransaction({
      //   mnemonic,
      //   recipient: form.values.recipient,
      //   amount: stxToMicroStx(form.values.amount),
      // });
      const demoTx = await makeSTXTokenTransfer({
        recipient: form.values.recipient,
        network: stacksNetwork,
        amount: new BN(stxToMicroStx(form.values.amount).toString()),
        senderKey: 'f0bc18b8c5adc39c26e0fe686c71c7ab3cc1755a3a19e6e1eb84b55f2ede95da01',
      });
      const { amount, fee } = {
        amount: stxToMicroStx(form.values.amount),
        fee: demoTx.auth.spendingCondition?.fee as BN,
      };
      setFee(fee);
      setTotal(amount.plus(fee.toString()));
      setAmount(amount);
      setStep(TxModalStep.PreviewTx);
      setLoading(false);
    },
  });

  if (!txModalOpen) return null;

  const closeModalResetForm = () => {
    setStep(TxModalStep.DescribeTx);
    setLoading(false);
    setFee(new BN(0));
    setAmount(new BigNumber(0));
    dispatch(homeActions.closeTxModal());
    form.resetForm();
  };

  const txFormStepMap: { [step in TxModalStep]: ModalComponents } = {
    [TxModalStep.DescribeTx]: () => ({
      header: <TxModalHeader onSelectClose={closeModalResetForm}>Send STX</TxModalHeader>,
      body: <TxModalForm balance={balance} form={form} />,
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={closeModalResetForm} {...buttonStyle}>
            Cancel
          </Button>
          <Button
            ml="base-tight"
            onClick={() => form.submitForm()}
            isLoading={loading}
            {...buttonStyle}
          >
            Preview
          </Button>
        </TxModalFooter>
      ),
    }),
    [TxModalStep.PreviewTx]: () => ({
      header: (
        <TxModalHeader onSelectClose={closeModalResetForm}>Preview transaction</TxModalHeader>
      ),
      body: (
        <TxModalPreview>
          <TxModalPreviewItem label="To">
            <Text fontSize="13px">{form.values.recipient}</Text>
          </TxModalPreviewItem>
          <TxModalPreviewItem label="Amount">
            {toHumanReadableStx(amount.toString())}
          </TxModalPreviewItem>
          <TxModalPreviewItem label="Fee">{toHumanReadableStx(fee)}</TxModalPreviewItem>
          <TxModalPreviewItem label="Total">
            {toHumanReadableStx(total.toString())}
          </TxModalPreviewItem>
          <Box minHeight="24px">
            {totalIsMoreThanBalance && (
              <ErrorLabel size="md" my="base-loose">
                <ErrorText fontSize="14px" lineHeight="20px">
                  You have insufficient balance to complete this transfer.
                </ErrorText>
              </ErrorLabel>
            )}
          </Box>
        </TxModalPreview>
      ),
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={() => setStep(TxModalStep.DescribeTx)} {...buttonStyle}>
            Go back
          </Button>
          <Button
            ml="base-tight"
            {...buttonStyle}
            isLoading={loading}
            isDisabled={totalIsMoreThanBalance}
            onClick={() => setStep(TxModalStep.ConfirmAndSend)}
          >
            Sign transaction and send
          </Button>
        </TxModalFooter>
      ),
    }),
    [TxModalStep.ConfirmAndSend]: () => ({
      header: <TxModalHeader onSelectClose={closeModalResetForm}>Confirm and send</TxModalHeader>,
      body: (
        // <Box mx="extra-loose" mt="extra-loose">
        //   <Text textStyle="body.large">Enter your password to confirm your transaction</Text>
        //   <Input onChange={handlePasswordInput} mt="base-loose" />
        //   {hasSubmitted && decryptionError && (
        //     <ErrorLabel>
        //       <ErrorText>Password entered is incorrect</ErrorText>
        //     </ErrorLabel>
        //   )}
        //   <Text textStyle="body.small" mt="base-tight" mb="base-loose" display="block">
        //     Forgot password? Reset your wallet to set a new password.
        //   </Text>
        // </Box>
        <DecryptWalletForm
          onSetPassword={password => setPassword(password)}
          hasSubmitted={hasSubmitted}
          decryptionError={decryptionError}
        />
      ),
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={() => setStep(TxModalStep.PreviewTx)} {...buttonStyle}>
            Go back
          </Button>
          <Button
            ml="base-tight"
            isLoading={isDecrypting}
            isDisabled={isDecrypting}
            onClick={broadcastTx}
            {...buttonStyle}
          >
            Send transaction
          </Button>
        </TxModalFooter>
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
