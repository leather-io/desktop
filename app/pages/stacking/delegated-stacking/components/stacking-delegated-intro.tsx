import React, { FC } from 'react';

import { ExternalLink } from '@components/external-link';

import { StackingTitle } from '../../components/stacking-title';
import { StackingDescription } from '../../components/stacking-description';

export const StackingDelegationIntro: FC = () => (
  <>
    <StackingTitle>Delegate Stacking</StackingTitle>
    <StackingDescription mt="base-tight">
      By delegating your STX, a service will stack on your behalf. Before delegating your STX, make
      sure you research which delegation service is right for you.
    </StackingDescription>
    <ExternalLink href="https://www.stacks.co" mt="base">
      You can discover services on stacks.co
    </ExternalLink>
  </>
);
