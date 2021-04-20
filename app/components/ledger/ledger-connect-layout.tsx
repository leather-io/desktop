import React, { FC } from 'react';
import { CheckmarkCircleIcon, color, Flex, FlexProps, Text } from '@stacks/ui';
import { LedgerConnectStep } from '@hooks/use-prepare-ledger';

interface LedgerStepTextProps {
  step: LedgerConnectStep;
}

export const LedgerStepText: FC<LedgerStepTextProps> = ({ step, children }) => {
  return (
    <>
      <Text
        color={color('invert')}
        fontWeight={500}
        mr="base-tight"
        display="inline-block"
        width="10px"
        textAlign="center"
      >
        {step + 1}
      </Text>
      {children}
    </>
  );
};

interface LedgerConnectStepRowProps extends FlexProps {
  isComplete: boolean;
  isLast?: boolean;
}

export const LedgerConnectStepRow: React.FC<LedgerConnectStepRowProps> = props => {
  const { isComplete, isLast, children, ...rest } = props;
  return (
    <Flex
      height="56px"
      alignItems="center"
      px="extra-loose"
      borderBottom={!isLast ? `1px solid ${color('border')}` : 'unset'}
      {...rest}
    >
      {children}
      {isComplete && <CheckmarkCircleIcon color={color('brand')} size="16px" ml="tight" />}
    </Flex>
  );
};
