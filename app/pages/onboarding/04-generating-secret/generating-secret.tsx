import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Spinner } from '@blockstack/ui';

import routes from '../../../constants/routes.json';
import { Onboarding, OnboardingTitle } from '../../../components/onboarding';

const GENERATION_TIME = 2_500;

export const GeneratingSecret = () => {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => history.push(routes.SECRET_KEY), GENERATION_TIME);
  }, []);
  return (
    <Onboarding pt="152px">
      <Spinner size="lg" color="blue" alignSelf="center" />
      <OnboardingTitle textStyle="header.small" fontWeight={500} fontSize="20px" mt="loose">
        Generating your Secret Key
      </OnboardingTitle>
    </Onboarding>
  );
};
