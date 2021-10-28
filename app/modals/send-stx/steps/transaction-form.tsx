import React, { FC } from 'react';
import { Flex, Text, Input, Box, Button, color } from '@stacks/ui';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { FormikProps } from 'formik';
import { capitalize } from '@utils/capitalize';
import { toHumanReadableStx } from '@utils/unit-convert';
import { HomeSelectors } from 'app/tests/features/home.selectors';
import { useAnalytics } from '@hooks/use-analytics';
interface TxModalFormProps {
  balance: string;
  form: FormikProps<{ recipient: string; amount: string; memo: string; noMemoRequired: boolean }>;
  isCalculatingMaxSpend: boolean;
  onSendEntireBalance(): void;
  feeEstimateError: string | null;
}

export const TxModalForm: FC<TxModalFormProps> = props => {
  const { balance, form, isCalculatingMaxSpend, feeEstimateError, onSendEntireBalance } = props;
  const analytics = useAnalytics();
  const onSendEntireBalanceTracked = () => {
    void analytics.track('select_maximum_amount_for_send');
    onSendEntireBalance();
  };
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
          data-test={HomeSelectors.InputSendStxFormAddress}
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
            data-test={HomeSelectors.InputSendStxFormAmount}
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
            type="button"
            size="sm"
            height="28px"
            right="12px"
            top="22px"
            style={{ position: 'absolute' }}
            width="80px"
            onClick={onSendEntireBalanceTracked}
            isLoading={isCalculatingMaxSpend}
          >
            Send max
          </Button>
        </Box>

        <Text
          textStyle="body.small.medium"
          mt="base-loose"
          mr="extra-tight"
          as="label"
          {...{ htmlFor: 'stxAmount' }}
        >
          Memo
        </Text>
        <Text textStyle="body.small" color={color('text-caption')} mt="tight">
          Exchanges often require a memo to credit the STX to your account.
        </Text>
        <Flex
          as="label"
          textStyle="body.small"
          color={color('text-body')}
          mt="base-tight"
          alignItems="baseline"
        >
          <Box mr="tight" mt="1px">
            <input
              type="checkbox"
              id="noMemoRequired"
              name="noMemoRequired"
              onChange={form.handleChange}
              checked={form.values.noMemoRequired}
            />
          </Box>
          I confirm no memo is required for this transaction
        </Flex>
        <Input
          id="memo"
          data-test={HomeSelectors.InputSendStxFormMemo}
          name="memo"
          inputMode="numeric"
          mt="base-loose"
          placeholder="Memo"
          isDisabled={form.values.noMemoRequired}
          onChange={form.handleChange}
          value={form.values.memo}
        />
        {form.touched.memo && form.errors.memo && (
          <ErrorLabel>
            <ErrorText>{capitalize(form.errors.memo)}</ErrorText>
          </ErrorLabel>
        )}
        {feeEstimateError && (
          <ErrorLabel>
            <ErrorText>{feeEstimateError}</ErrorText>
          </ErrorLabel>
        )}
      </Flex>
    </Box>
  );
};
