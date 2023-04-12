import { Onboarding, OnboardingTitle } from '@components/onboarding';
import { AllowDiagnosticsLayout } from '@components/request-diagnostics.layout';
import routes from '@constants/routes.json';
import { useBackButton } from '@hooks/use-back-url';
import { Flex } from '@stacks/ui';
import { grantDiagnosticsPermission, revokeDiagnosticPermission } from '@store/settings';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export function Diagnostics() {
  const history = useHistory();
  const dispatch = useDispatch();
  useBackButton(routes.TERMS);

  return (
    <Onboarding maxWidth="800px" px="base-loose">
      <OnboardingTitle mb="base" mt="extra-loose">
        Help us improve
      </OnboardingTitle>
      <Flex
        flexDirection="column"
        justifyContent="center"
        textAlign="center"
        alignItems="center"
        mt="extra-loose"
        pb="extra-loose"
      >
        <AllowDiagnosticsLayout
          onUserAllowDiagnostics={() => {
            dispatch(grantDiagnosticsPermission());
            history.push(routes.WELCOME);
          }}
          onUserDenyDiagnosticsPermissions={() => {
            dispatch(revokeDiagnosticPermission());
            history.push(routes.WELCOME);
          }}
        />
      </Flex>
    </Onboarding>
  );
}
