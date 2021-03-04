import React, { FC } from 'react';
import { CheckmarkCircleIcon, Flex, FlexProps, Text } from '@blockstack/ui';
import { LedgerConnectStep } from '@hooks/use-prepare-ledger';

interface LedgerStepTextProps {
  step: LedgerConnectStep;
}
export const LedgerStepText: FC<LedgerStepTextProps> = ({ step, children }) => {
  return (
    <>
      <Text
        color="ink"
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
      borderBottom={!isLast ? '1px solid #F0F0F5' : 'unset'}
      {...rest}
    >
      {children}
      {isComplete && <CheckmarkCircleIcon color="blue" size="16px" ml="tight" />}
    </Flex>
  );
};
