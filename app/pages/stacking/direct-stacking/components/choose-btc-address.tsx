import React, { FC } from 'react';
import { useFormik } from 'formik';

import { btcAddressValidator } from '@utils/validators/btc-address-validator';
import { StackingStepBaseProps } from '../../utils/abstract-stacking-step';
import {
  StackingStep as Step,
  StackingStepAction as Action,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { CryptoAddressForm } from '../../components/crypto-address-form';

interface ChooseBtcAddressStepProps extends StackingStepBaseProps {
  description: string;
  value?: string;
  onEdit(): void;
  onComplete(address: string): void;
}

export const ChooseBtcAddressStep: FC<ChooseBtcAddressStepProps> = props => {
  const { isComplete, description, state, step, title, value, onEdit, onComplete } = props;

  const btcAddressForm = useFormik({
    initialValues: { btcAddress: '' },
    validate: ({ btcAddress }) => btcAddressValidator(btcAddress),
    onSubmit: ({ btcAddress }) => onComplete(btcAddress),
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

      <CryptoAddressForm form={btcAddressForm} fieldName="btcAddress" placeholder="Bitcoin address">
        <Action type="submit">Continue</Action>
      </CryptoAddressForm>
    </Step>
  );
};
