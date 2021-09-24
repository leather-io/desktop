import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Flex } from '@stacks/ui';

import routes from '@constants/routes.json';
import { Onboarding, OnboardingTitle } from '@components/onboarding';
import { useBackButton } from '@hooks/use-back-url';
import { AllowDiagnosticsLayout } from '@components/request-diagnostics.layout';
import { grantDiagnosticsPermission, revokeDiagnosticPermission } from '@store/settings';

export const Diagnostics: React.FC = memo(() => {
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
});
