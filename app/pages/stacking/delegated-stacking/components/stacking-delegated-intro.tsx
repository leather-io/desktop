import React, { FC } from 'react';

import { ExternalLink } from '@components/external-link';

import { StackingTitle } from '../../components/stacking-title';
import { StackingDescription } from '../../components/stacking-description';

export const StackingDelegationIntro: FC = () => (
  <>
    <StackingTitle>Stack with others</StackingTitle>
    <StackingDescription mt="base-tight">
      Delegate to a pool that will lock your STX with others. Make sure to research which pool is
      right for you before proceeding.
    </StackingDescription>
    <ExternalLink href="https://www.stacks.co/stacking#services" mt="base" color="blue">
      Discover pools on stacks.co
    </ExternalLink>
  </>
);
