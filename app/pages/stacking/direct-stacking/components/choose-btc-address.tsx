import React, { FC, memo } from 'react';
import { useField } from 'formik';

import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { STACKING_ADDRESS_FORMAT_HELP_URL } from '@constants/index';
import { ExternalLink } from '@components/external-link';

import {
  StackingStep as Step,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { CryptoAddressInput } from '../../components/crypto-address-form';
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

export const ChooseBtcAddressField: FC = () => {
  const [field, meta] = useField('btcAddress');

  const errors = meta.error ? (
    <ErrorLabel maxWidth="430px">
      <ErrorText lineHeight="18px">
        {meta.error === 'is-bech32' ? <StackingAddressErrorExplainer /> : meta.error}
      </ErrorText>
    </ErrorLabel>
  ) : null;

  return (
    <Step title="Bitcoin address">
      <Description>Choose the address where you’d like to receive bitcoin.</Description>
      <CryptoAddressInput fieldName="btcAddress" placeholder="Bitcoin address" {...field}>
        {meta.touched && errors}
      </CryptoAddressInput>
    </Step>
  );
};
