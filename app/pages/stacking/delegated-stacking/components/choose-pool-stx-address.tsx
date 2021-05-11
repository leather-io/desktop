import React, { FC, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFocus } from 'use-events';
import { useField } from 'formik';
import { Text } from '@stacks/ui';

import { selectAddress } from '@store/keys';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { ExternalLink } from '@components/external-link';

import {
  StackingStep as Step,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';

import { CryptoAddressInput } from '../../components/crypto-address-form';

export const ChoosePoolStxAddressField: FC = () => {
  const address = useSelector(selectAddress);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, bindFocus] = useFocus();
  const [field, meta] = useField('stxAddress');

  return (
    <Step title="Pool address">
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
      <CryptoAddressInput
        ref={inputRef}
        fieldName="stxAddress"
        placeholder="Pool address"
        {...bindFocus}
        {...field}
      >
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </CryptoAddressInput>
    </Step>
  );
};
