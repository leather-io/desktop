import React, { FC } from 'react';
import { Flex, Text, Input, Box, Button } from '@blockstack/ui';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { FormikProps } from 'formik';
import { capitalize } from '@utils/capitalize';
import { toHumanReadableStx } from '@utils/unit-convert';

interface TxModalFormProps {
  balance: string;
  form: FormikProps<{ recipient: string; amount: string; memo: string }>;
  isCalculatingMaxSpend: boolean;
  onSendEntireBalance(): void;
}

export const TxModalForm: FC<TxModalFormProps> = args => {
  const { balance, form, isCalculatingMaxSpend, onSendEntireBalance } = args;
  return (
    <Box mb="extra-loose">
      <Flex flexDirection="column" alignItems="center" mt="48px">
        <Text textStyle="body.large.medium">Available balance</Text>
        <Text textStyle="body.large.medium" fontWeight={600} mt="tight" fontSize="32px">
          {toHumanReadableStx(balance)}
        </Text>
      </Flex>
      <Flex flexDirection="column" mt="40px" mx="extra-loose">
        <Text textStyle="body.small.medium" as="label" {...{ htmlFor: 'stxAddress' }}>
          Send to
        </Text>
        <Input
          id="stxAddress"
          name="recipient"
          mt="base-tight"
          placeholder="STX address"
          onChange={form.handleChange}
          value={form.values.recipient}
        />
        {form.touched.recipient && form.errors.recipient && (
          <ErrorLabel>
            <ErrorText>{form.errors.recipient}</ErrorText>
          </ErrorLabel>
        )}
        <Text
          textStyle="body.small.medium"
          mt="base-loose"
          as="label"
          {...{ htmlFor: 'stxAmount' }}
        >
          Amount
        </Text>
        <Box position="relative">
          <Input
            id="stxAmount"
            name="amount"
            inputMode="numeric"
            pattern="[0-9]*"
            mt="base-tight"
            placeholder="0.000000 STX"
            onChange={form.handleChange}
            value={form.values.amount}
          />
          {form.touched.amount && form.errors.amount && (
            <ErrorLabel>
              <ErrorText>{capitalize(form.errors.amount)}</ErrorText>
            </ErrorLabel>
          )}
          <Button
            mode="tertiary"
            size="sm"
            height="28px"
            right="12px"
            top="22px"
            style={{ position: 'absolute' }}
            width="80px"
            onClick={onSendEntireBalance}
            isLoading={isCalculatingMaxSpend}
          >
            Send max
          </Button>
        </Box>
        <Text
          textStyle="body.small.medium"
          mt="base-loose"
          as="label"
          {...{ htmlFor: 'stxAmount' }}
        >
          Memo
        </Text>
        <Input
          id="memo"
          name="memo"
          inputMode="numeric"
          mt="base-tight"
          placeholder="Memo"
          onChange={form.handleChange}
          value={form.values.memo}
        />
        {form.touched.memo && form.errors.memo && (
          <ErrorLabel>
            <ErrorText>{capitalize(form.errors.memo)}</ErrorText>
          </ErrorLabel>
        )}
      </Flex>
    </Box>
  );
};
