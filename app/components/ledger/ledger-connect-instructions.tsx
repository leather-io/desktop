import React, { FC } from 'react';
import { Box, Flex, Text, EncryptionIcon, color } from '@stacks/ui';

import { LedgerConnectStepRow, LedgerStepText } from './ledger-connect-layout';
import { LedgerConnectStep } from '@hooks/use-prepare-ledger';

interface LedgerConnectInstructions {
  step: LedgerConnectStep;
  action: string;
  isLocked: boolean;
}

const hasConnected = (step: LedgerConnectStep) => step > LedgerConnectStep.Disconnected;
const hasOpenedApp = (step: LedgerConnectStep) => step > LedgerConnectStep.ConnectedAppClosed;
const hasAddress = (step: LedgerConnectStep) => step === LedgerConnectStep.ActionComplete;

export const LedgerConnectInstructions: FC<LedgerConnectInstructions> = props => {
  const { step, action, isLocked } = props;
  return (
    <>
      <Box border={`1px solid ${color('border')}`} mt="extra-loose" borderRadius="8px">
        <LedgerConnectStepRow isComplete={hasConnected(step)}>
          <LedgerStepText step={LedgerConnectStep.Disconnected}>Connect your Ledger</LedgerStepText>
        </LedgerConnectStepRow>

        <LedgerConnectStepRow isComplete={hasOpenedApp(step)}>
          <LedgerStepText step={LedgerConnectStep.ConnectedAppClosed}>
            Open the Stacks app
          </LedgerStepText>
        </LedgerConnectStepRow>

        <LedgerConnectStepRow isComplete={hasAddress(step)} isLast>
          <LedgerStepText step={LedgerConnectStep.ConnectedAppOpen}>{action}</LedgerStepText>
        </LedgerConnectStepRow>
      </Box>

      {isLocked && (
        <Flex mt="base">
          <EncryptionIcon size="12px" mt="2px" color={color('text-caption')} />
          <Text textStyle="caption" ml="extra-tight" color={color('text-caption')}>
            Your Ledger device is locked. To continue, press a button your and device and enter your
            PIN code.
          </Text>
        </Flex>
      )}
    </>
  );
};
