import React, { FC } from 'react';

import { ExternalLink } from '@components/external-link';
import { Title } from '@components/title';
import { StackingDescription } from '../../components/stacking-description';
import { NextCycleInfo } from '../../components/next-cycle-info';

interface StackingIntroProps {
  timeUntilNextCycle: string;
}
export const DirectStackingIntro: FC<StackingIntroProps> = ({ timeUntilNextCycle }) => (
  <>
    <Title>Stack by yourself</Title>
    <StackingDescription mt="base-tight">
      When you stack by yourself, you’ll get the chance to earn Bitcoin each cycle for every reward
      slot that you hold.
    </StackingDescription>
    <StackingDescription mt="base-tight">
      The STX required per reward slot can fluctuate from cycle to cycle. If you’re close to the
      current minimum, consider pooling instead to help make sure you don’t end up without rewards.
    </StackingDescription>
    <ExternalLink href="https://stacks.co/stacking" mt="base">
      How it works
    </ExternalLink>
    <NextCycleInfo timeUntilNextCycle={timeUntilNextCycle} mt="loose" />
  </>
);
