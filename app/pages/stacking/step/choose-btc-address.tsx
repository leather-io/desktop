import React, { FC } from 'react';
import { Input } from '@blockstack/ui';
import { useFormik } from 'formik';
import validate from 'bitcoin-address-validation';

import { ErrorText } from '@components/error-text';
import { ErrorLabel } from '@components/error-label';
import { NETWORK, SUPPORTED_BTC_ADDRESS_FORMATS } from '@constants/index';

import {
  StackingStep,
  StackingStepAction,
  StackingStepDescription,
} from '../components/stacking-form-step';

interface ChooseBtcAddressStepProps {
  id: string;
  step?: number;
  isComplete: boolean;
  value?: string;
  onEdit(): void;
  onComplete(address: string): void;
}

export const ChooseBtcAddressStep: FC<ChooseBtcAddressStepProps> = props => {
  const { isComplete, step, id, value, onEdit, onComplete } = props;

  const btcAddressForm = useFormik({
    initialValues: { btcAddress: '' },
    validate: ({ btcAddress }) => {
      const address = validate(btcAddress);
      if (!address) return { btcAddress: 'Invalid BTC address' };
      if (NETWORK === 'mainnet' && address.network === 'testnet') {
        return { btcAddress: 'Testnet addresses not supported on Mainnet' };
      }
      // https://github.com/blockstack/stacks-blockchain/issues/1902
      if (!SUPPORTED_BTC_ADDRESS_FORMATS.includes(address.type as any)) {
        return {
          btcAddress: 'Only Pubkey hash (p2pkh) and Script hash (p2sh) addresses are supported',
        };
      }
      return {};
    },
    onSubmit: ({ btcAddress }) => onComplete(btcAddress),
  });

  return (
    <StackingStep title={id} step={step} value={value} isComplete={isComplete} onEdit={onEdit}>
      <StackingStepDescription>
        Choose the address where you’d like to receive Bitcoin.
      </StackingStepDescription>

      <form onSubmit={btcAddressForm.handleSubmit}>
        <Input
          id="btcAddress"
          name="btcAddress"
          onChange={btcAddressForm.handleChange}
          value={btcAddressForm.values.btcAddress}
          placeholder="Bitcoin address"
          mt="loose"
          maxWidth="400px"
          fontFamily={btcAddressForm.values.btcAddress.length ? 'monospace' : null}
        />
        {btcAddressForm.touched.btcAddress && btcAddressForm.errors.btcAddress && (
          <ErrorLabel>
            <ErrorText>{btcAddressForm.errors.btcAddress}</ErrorText>
          </ErrorLabel>
        )}
        <StackingStepAction type="submit">Continue</StackingStepAction>
      </form>
    </StackingStep>
  );
};
