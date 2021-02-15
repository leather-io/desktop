import React, { FC } from 'react';

import { ExternalLink } from '@components/external-link';
import { StackingTitle } from '../../components/stacking-title';
import { StackingDescription } from '../../components/stacking-description';
import { NextCycleInfo } from '../../components/next-cycle-info';

interface StackingIntroProps {
  timeUntilNextCycle: string;
}
export const DirectStackingIntro: FC<StackingIntroProps> = ({ timeUntilNextCycle }) => (
  <>
    <StackingTitle>Start earning Bitcoin</StackingTitle>
    <StackingDescription mt="base-tight">
      Help secure the Stacks Blockchain and earn Bitcoin by temporarily locking your STX in your
      wallet. Your STX never leave your wallet.
    </StackingDescription>
    <ExternalLink
      href="https://www.blockstack.org/questions/how-does-stacking-work"
      mt="base"
      color="blue"
    >
      How it works
    </ExternalLink>
    <NextCycleInfo timeUntilNextCycle={timeUntilNextCycle} mt="loose" />
  </>
);
