import React, { FC } from 'react';
import { FiCheck } from 'react-icons/fi';
import { Box, Button, Flex, color, Stack, Text, FlexProps } from '@stacks/ui';

import { OnboardingSelector } from 'app/tests/features/onboarding.selectors';

interface ReasonToAllowDiagnosticsProps extends FlexProps {
  text: string;
}
const ReasonToAllowDiagnostics: FC<ReasonToAllowDiagnosticsProps> = ({ text, ...props }) => {
  return (
    <Flex color={color('text-caption')} textStyle="body.small" {...props}>
      <Box mr="tight" mt="3px">
        <FiCheck />
      </Box>
      <Box>{text}</Box>
    </Flex>
  );
};

interface AllowDiagnosticsLayoutProps {
  onUserAllowDiagnostics(): void;
  onUserDenyDiagnosticsPermissions(): void;
}
export const AllowDiagnosticsLayout: FC<AllowDiagnosticsLayoutProps> = props => {
  const { onUserAllowDiagnostics, onUserDenyDiagnosticsPermissions } = props;

  return (
    <>
      <Text maxWidth="520px">
        We would like to gather de-identified usage data to help improve your experience with Hiro
        Wallet.
      </Text>
      <Stack mt="loose" mb="extra-loose" spacing="base-tight" textAlign="left" maxWidth="520px">
        <ReasonToAllowDiagnostics text="Send anonymous data about page views and clicks" />
        <ReasonToAllowDiagnostics text="This data is tied to randomly-generated IDs and not personal data, such as your Stacks addresses, keys, balance, or IP addresses" />
        <ReasonToAllowDiagnostics text="This data is used to generate and send crash reports, help us fix errors, and analyze trends and statistics" />
      </Stack>
      <Flex mt="base" fontSize="14px">
        <Button
          type="button"
          mode="primary"
          px="extra-loose"
          onClick={() => onUserAllowDiagnostics()}
          data-test={OnboardingSelector.BtnAcceptDiagnosticPermission}
          mr="base-tight"
        >
          Allow
        </Button>
        <Button
          type="button"
          mode="tertiary"
          px="extra-loose"
          ml="base"
          variant="link"
          onClick={() => onUserDenyDiagnosticsPermissions()}
        >
          Deny
        </Button>
      </Flex>
    </>
  );
};
