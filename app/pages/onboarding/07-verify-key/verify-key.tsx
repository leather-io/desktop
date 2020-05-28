import React from 'react';
import { Link } from 'react-router-dom';
import { Text, Input } from '@blockstack/ui';

import routes from '../../../constants/routes.json';
import { ErrorLabel } from '../../../components/error-label';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingText,
  OnboardingButton,
  OnboardingFooter,
  OnboardingFooterLink,
} from '../../../components/onboarding';

export const VerifyKey: React.FC = () => {
  return (
    <Onboarding>
      <OnboardingTitle>Verify Secret Key</OnboardingTitle>
      <OnboardingText>Enter your Secret Key to confirm you’ve saved it</OnboardingText>
      <Input
        as="textarea"
        mt="extra-loose"
        height="88px"
        placeholder="24-word Secret Key"
        style={{ resize: 'none' }}
      />
      <ErrorLabel>
        {/* TODO: Create a UI library type of `caption.error` */}
        <Text textAlign="left" display="block" textStyle="caption" color="feedback.error">
          The Secret Key you've entered doesn't match
        </Text>
      </ErrorLabel>
      <OnboardingButton mt="loose">Continue</OnboardingButton>
      <OnboardingFooter>
        <Link to={routes.SECRET_KEY}>
          <OnboardingFooterLink>View Secret Key again</OnboardingFooterLink>
        </Link>
      </OnboardingFooter>
    </Onboarding>
  );
};
