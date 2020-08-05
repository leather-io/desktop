import React, { FC } from 'react';
import { Box, Flex, CheckmarkCircleIcon } from '@blockstack/ui';

import { LedgerConnectStep } from '../../pages/onboarding';
import { LedgerStepText } from './ledger-step-text';

interface LedgerConnectInstructions {
  step: LedgerConnectStep;
}

export const LedgerConnectInstructions: FC<LedgerConnectInstructions> = ({ step }) => {
  const hasConnected = (step: LedgerConnectStep) => step > LedgerConnectStep.Disconnected;
  const hasOpenedApp = (step: LedgerConnectStep) => step > LedgerConnectStep.ConnectedAppClosed;
  const hasAddress = (step: LedgerConnectStep) => step === LedgerConnectStep.HasAddress;

  return (
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
        <LedgerStepText step={LedgerConnectStep.ConnectedAppOpen}>
          Confirm your Ledger address
        </LedgerStepText>
        {hasAddress(step) && <CheckmarkCircleIcon color="blue" size="16px" ml="tight" />}
      </Flex>
    </Box>
  );
};
