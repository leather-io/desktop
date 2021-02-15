import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';

import { stxAddressValidator } from '@utils/validators/stx-address-validator';
import { selectAddress } from '@store/keys';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';

import { StackingStepBaseProps } from '../../utils/abstract-stacking-step';
import {
  StackingStep as Step,
  StackingStepAction as Action,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { CryptoAddressForm } from '../../components/crypto-address-form';

interface ChooseDelegatorStxAddressStepProps extends StackingStepBaseProps {
  description: string;
  value?: string;
  onEdit(): void;
  onComplete(address: string): void;
}

export const ChooseDelegatorStxAddressStep: FC<ChooseDelegatorStxAddressStepProps> = props => {
  const { isComplete, description, state, step, title, value, onEdit, onComplete } = props;

  const address = useSelector(selectAddress);

  const stxAddressForm = useFormik({
    initialValues: { stxAddress: '' },
    validate: ({ stxAddress }) => {
      if (stxAddress === address) return { stxAddress: 'Cannot delegate to your own STX address' };
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
      <Description>{description}</Description>
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
