import React, { FC } from 'react';
import { Flex, Text, Input, Box } from '@blockstack/ui';
import { ErrorLabel } from '../../components/error-label';
import { ErrorText } from '../../components/error-text';
import { FormikProps } from 'formik';
import { capitalize } from '../../utils/capitalize';

interface TxModalFormProps {
  balance: string;
  form: FormikProps<{ address: string; amount: string }>;
}

export const TxModalForm: FC<TxModalFormProps> = ({ balance, form }) => {
  return (
    <Box mb="extra-loose">
      <Flex flexDirection="column" alignItems="center" mt="48px">
        <Text textStyle="body.large.medium">Available balance</Text>
        <Text textStyle="body.large.medium" fontWeight={600} mt="tight" fontSize="32px">
          {balance}
        </Text>
      </Flex>
      <Flex flexDirection="column" mt="40px" mx="extra-loose">
        <Text textStyle="body.small.medium" as="label">
          <label htmlFor="stxAddress">Send to</label>
        </Text>
        <Input
          id="stxAddress"
          name="address"
          autoFocus
          mt="base-tight"
          placeholder="STX address"
          onChange={form.handleChange}
          value={form.values.address}
        />
        {form.touched.address && form.errors.address && (
          <ErrorLabel>
            <ErrorText>{form.errors.address}</ErrorText>
          </ErrorLabel>
        )}
        <Text textStyle="body.small.medium" mt="base-loose" as="label">
          <label htmlFor="stxAmount">Amount</label>
        </Text>
        <Input
          id="stxAmount"
          name="amount"
          inputMode="numeric"
          pattern="[0-9]*"
          mt="base-tight"
          placeholder="0.00000 STX"
          onChange={form.handleChange}
          value={form.values.amount}
        />
        {form.touched.amount && form.errors.amount && (
          <ErrorLabel>
            <ErrorText>{capitalize(form.errors.amount)}</ErrorText>
          </ErrorLabel>
        )}
      </Flex>
    </Box>
  );
};
