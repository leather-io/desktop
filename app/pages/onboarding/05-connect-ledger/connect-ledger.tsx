import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { LedgerConnectInstructions } from '@components/ledger/ledger-connect-instructions';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingText,
  OnboardingButton,
} from '@components/onboarding';
import routes from '@constants/routes.json';
import { useBackButton } from '@hooks/use-back-url';
import { usePrepareLedger, LedgerConnectStep } from '@hooks/use-prepare-ledger';
import { Box, color, Text } from '@stacks/ui';
import { setLedgerWallet } from '@store/keys';
import { delay } from '@utils/delay';
import { isMainnet } from '@utils/network-utils';
import { LedgerError } from '@zondax/ledger-blockstack';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export const ConnectLedger: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [didRejectTx, setDidRejectTx] = useState(false);
  const [hasConfirmedAddress, setHasConfirmedAddress] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const [ledgerLaunchVersionError, setLedgerLaunchVersionError] = useState<string | null>(null);
  useBackButton(routes.CREATE);

  const { step, isLocked, appVersionErrorText, isSupportedAppVersion } = usePrepareLedger();

  const dispatch = useDispatch();
  const history = useHistory();

  async function handleLedger() {
    setDeviceError(null);
    setLoading(true);

    try {
      const deviceResponse = await main.ledger.requestAndConfirmStxAddress();
      if (deviceResponse.returnCode === LedgerError.TransactionRejected) {
        setDidRejectTx(true);
        setLoading(false);
        return;
      }

      if (deviceResponse.returnCode === 0xffff) {
        throw new Error(deviceResponse.errorMessage);
      }

      if ('publicKey' in deviceResponse) {
        setLoading(true);
        setHasConfirmedAddress(true);
        await delay(750);
        if (isMainnet() && !deviceResponse.address.startsWith('SP')) {
          setLedgerLaunchVersionError(
            'Make sure you have the most recent version of Ledger app. Address generated is for testnet'
          );
          return;
        }
        dispatch(
          setLedgerWallet({
            address: deviceResponse.address,
            publicKey: deviceResponse.publicKey,
            onSuccess: () => history.push(routes.HOME),
          })
        );
      }
    } catch (e) {
      setLoading(false);
      setDeviceError(String(e));
    }
  }

  return (
    <Onboarding>
      <OnboardingTitle>Connect your Ledger</OnboardingTitle>
      <OnboardingText>Follow these steps to connect your Ledger Nano S or X</OnboardingText>
      <Box>
        <Text
          textStyle="caption"
          color={color('text-caption')}
          mt="tight"
          display="block"
          textAlign="center"
          lineHeight="18px"
        >
          Press both buttons on your Ledger device simultaneously
        </Text>
      </Box>
      <LedgerConnectInstructions
        action="Confirm your address"
        step={hasConfirmedAddress ? LedgerConnectStep.ActionComplete : step}
        isLocked={isLocked}
      />
      {deviceError && (
        <ErrorLabel mt="base-loose">
          <ErrorText>{deviceError}</ErrorText>
        </ErrorLabel>
      )}
      {ledgerLaunchVersionError !== null && (
        <ErrorLabel mt="base-loose">
          <ErrorText>{ledgerLaunchVersionError}</ErrorText>
        </ErrorLabel>
      )}
      {didRejectTx && (
        <ErrorLabel mt="base-loose">
          <ErrorText>You must approve the action that appears on your Ledger device</ErrorText>
        </ErrorLabel>
      )}
      {!isSupportedAppVersion && (
        <ErrorLabel mt="base-loose">
          <ErrorText>{appVersionErrorText}</ErrorText>
        </ErrorLabel>
      )}
      <OnboardingButton
        mt="loose"
        onClick={handleLedger}
        isDisabled={step < 2 || loading || isLocked || !isSupportedAppVersion}
        isLoading={loading}
      >
        Continue
      </OnboardingButton>
    </Onboarding>
  );
};
