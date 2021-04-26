import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Text } from '@stacks/ui';

import { stxAddressValidator } from '@utils/validators/stx-address-validator';
import { selectAddress } from '@store/keys';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { ExternalLink } from '@components/external-link';

import { StackingStepBaseProps } from '../../utils/abstract-stacking-step';
import {
  StackingStep as Step,
  StackingStepAction as Action,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { CryptoAddressForm } from '../../components/crypto-address-form';

interface ChoosePoolStxAddressStepProps extends StackingStepBaseProps {
  value?: string;
  onEdit(): void;
  onComplete(address: string): void;
}

export const ChoosePoolStxAddressStep: FC<ChoosePoolStxAddressStepProps> = props => {
  const { isComplete, state, step, title, value, onEdit, onComplete } = props;

  const address = useSelector(selectAddress);

  const stxAddressForm = useFormik({
    initialValues: { stxAddress: '' },
    validate: ({ stxAddress }) => {
      if (stxAddress === address) return { stxAddress: 'Cannot pool to your own STX address' };
      return stxAddressValidator(stxAddress);
    },
    onSubmit: ({ stxAddress }) => onComplete(stxAddress),
  });

  return (
    <Step
      title={title}
      step={step}
      state={state}
      value={value}
      isComplete={isComplete}
      onEdit={onEdit}
    >
      <Description>
        <Text>
          Enter the STX address of the pool with which you’d like to Stack without your STX leaving
          your wallet.
        </Text>
        <Text>
          The pool will provide this address for you. Pools can have different addresses that
          correspond to particular durations.
        </Text>
        <ExternalLink href="https://stacks.co/stacking#services">
          Discover pools on stacks.co
        </ExternalLink>
      </Description>
      <CryptoAddressForm form={stxAddressForm} fieldName="stxAddress" placeholder="STX Address">
        {stxAddressForm.touched.stxAddress && stxAddressForm.errors.stxAddress && (
          <ErrorLabel>
            <ErrorText>{stxAddressForm.errors.stxAddress}</ErrorText>
          </ErrorLabel>
        )}
        <Action type="submit">Continue</Action>
      </CryptoAddressForm>
    </Step>
  );
};
