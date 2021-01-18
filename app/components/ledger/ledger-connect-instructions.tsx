import React, { FC } from 'react';
import { Box, Flex, Text, CheckmarkCircleIcon, EncryptionIcon } from '@blockstack/ui';

import { LedgerStepText } from './ledger-step-text';
import { LedgerConnectStep } from '@hooks/use-prepare-ledger';

interface LedgerConnectInstructions {
  step: LedgerConnectStep;
  action: string;
  isLocked?: boolean;
}

export const LedgerConnectInstructions: FC<LedgerConnectInstructions> = props => {
  const { step, action, isLocked } = props;

  const hasConnected = (step: LedgerConnectStep) => step > LedgerConnectStep.Disconnected;
  const hasOpenedApp = (step: LedgerConnectStep) => step > LedgerConnectStep.ConnectedAppClosed;
  const hasAddress = (step: LedgerConnectStep) => step === LedgerConnectStep.ActionComplete;

  return (
    <>
      <Box border="1px solid #F0F0F5" mt="extra-loose" borderRadius="8px">
        <Flex height="56px" alignItems="center" px="extra-loose" borderBottom="1px solid #F0F0F5">
          <LedgerStepText step={LedgerConnectStep.Disconnected}>Connect your Ledger</LedgerStepText>
          {hasConnected(step) && <CheckmarkCircleIcon color="blue" size="16px" ml="tight" />}
        </Flex>
        <Flex height="56px" alignItems="center" px="extra-loose" borderBottom="1px solid #F0F0F5">
          <LedgerStepText step={LedgerConnectStep.ConnectedAppClosed}>
            Open the Stacks app
          </LedgerStepText>
          {hasOpenedApp(step) && <CheckmarkCircleIcon color="blue" size="16px" ml="tight" />}
        </Flex>
        <Flex height="56px" alignItems="center" px="extra-loose">
          <LedgerStepText step={LedgerConnectStep.ConnectedAppOpen}>{action}</LedgerStepText>
          {hasAddress(step) && <CheckmarkCircleIcon color="blue" size="16px" ml="tight" />}
        </Flex>
      </Box>
      {isLocked && (
        <Flex mt="base">
          <EncryptionIcon size="12px" mt="2px" color="ink.600" />
          <Text textStyle="caption" ml="extra-tight" color="ink.600">
            Your Ledger device is locked. To continue, press a button your and device and enter your
            PIN code.
          </Text>
        </Flex>
      )}
    </>
  );
};
