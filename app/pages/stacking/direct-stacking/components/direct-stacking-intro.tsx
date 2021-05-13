import React, { FC } from 'react';

import { Title } from '@components/title';
import { StackingDescription } from '../../components/stacking-description';
import { NextCycleStartTime } from '../../components/next-cycle-start-time';

interface StackingIntroProps {
  timeUntilNextCycle: string;
}
export const DirectStackingIntro: FC<StackingIntroProps> = ({ timeUntilNextCycle }) => (
  <>
    <Title>Stack by yourself</Title>
    <StackingDescription mt="base-loose">
      When you stack by yourself, you’ll get the chance to earn Bitcoin each cycle for every reward
      slot that you hold.
    </StackingDescription>
    <StackingDescription mt="base">
      The STX required per reward slot can fluctuate from cycle to cycle. If you’re close to the
      current minimum, consider pooling instead to help make sure you don’t end up without rewards.
    </StackingDescription>
    <NextCycleStartTime nextCycleStartsIn={timeUntilNextCycle} mt="40px" />
  </>
);
