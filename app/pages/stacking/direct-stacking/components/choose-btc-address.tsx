import React, { FC, memo } from 'react';
import { useFormik } from 'formik';
import validate from 'bitcoin-address-validation';

import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { isMainnet, isTestnet } from '@utils/network-utils';
import { STACKING_ADDRESS_FORMAT_HELP_URL, SUPPORTED_BTC_ADDRESS_FORMATS } from '@constants/index';
import { ExternalLink } from '@components/external-link';

import { StackingStepBaseProps } from '../../utils/abstract-stacking-step';
import {
  StackingStep as Step,
  StackingStepAction as Action,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { CryptoAddressForm } from '../../components/crypto-address-form';
import { ExplainerLabel } from '@components/tooltip';

const StackingAddressErrorExplainer = memo(() => (
  <>
    Please use a
    <ExplainerLabel text="Legacy, or P2PKH, Bitcoin addresses begin with the number 1">
      Legacy
    </ExplainerLabel>
    or
    <ExplainerLabel text="SegWit (Segregated Witness), or P2SH, Bitcoin addresses begin with the number 3">
      SegWit
    </ExplainerLabel>
    address.
    <ExplainerLabel text="Native SegWit addresses begin with the letters bc">
      Native SegWit
    </ExplainerLabel>
    addresses are not supported.
    <ExternalLink
      href={STACKING_ADDRESS_FORMAT_HELP_URL}
      textDecoration="underline"
      display="inline-block"
      ml="extra-tight"
    >
      Learn more
    </ExternalLink>
  </>
));

interface ChooseBtcAddressStepProps extends StackingStepBaseProps {
  description: string;
  value?: string;
  onEdit(): void;
  onComplete(address: string): void;
}

export const ChooseBtcAddressStep: FC<ChooseBtcAddressStepProps> = props => {
  const { isComplete, description, state, step, title, value, onEdit, onComplete } = props;

  const form = useFormik({
    initialValues: { btcAddress: '' },
    validate: ({ btcAddress }) => {
      const validationReport = validate(btcAddress);
      console.log(validationReport);
      if (!validationReport) return { btcAddress: 'Invalid BTC address' };
      if (isMainnet() && validationReport.network === 'testnet') {
        return { btcAddress: 'Testnet addresses not supported on Mainnet' };
      }
      if (isTestnet() && validationReport.network !== 'testnet') {
        return { btcAddress: 'Mainnet addresses not supported on Testnet' };
      }
      // https://github.com/blockstack/stacks-blockchain/issues/1902
      if (!SUPPORTED_BTC_ADDRESS_FORMATS.includes(validationReport.type as any)) {
        return { btcAddress: 'is-bech32' };
      }
      return {};
    },
    onSubmit: ({ btcAddress }) => onComplete(btcAddress),
  });

  const errors = form.errors.btcAddress ? (
    <ErrorLabel maxWidth="430px">
      <ErrorText lineHeight="18px">
        {form.errors.btcAddress === 'is-bech32' ? (
          <StackingAddressErrorExplainer />
        ) : (
          form.errors.btcAddress
        )}
      </ErrorText>
    </ErrorLabel>
  ) : null;

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
      <CryptoAddressForm form={form} fieldName="btcAddress" placeholder="Bitcoin address">
        {form.touched.btcAddress && errors}
        <Action type="submit">Continue</Action>
      </CryptoAddressForm>
    </Step>
  );
};
