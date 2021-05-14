import React, { FC } from 'react';
import { Flex } from '@stacks/ui';

import { Title } from '@components/title';
import { toHumanReadableStx } from '@utils/unit-convert';
import { StackingDescription } from '../../components/stacking-description';
import { NextCycleStartTime } from '../../components/next-cycle-start-time';
import { EstimatedMinimumLabel } from '../../components/estimated-minimum-label';

interface StackingIntroProps {
  timeUntilNextCycle: string;
  estimatedStackingMinimum: string;
}
export const DirectStackingIntro: FC<StackingIntroProps> = props => {
  const { timeUntilNextCycle, estimatedStackingMinimum } = props;
  return (
    <>
      <Title>Stack by yourself</Title>
      <StackingDescription mt="base-loose">
        When you stack by yourself, you’ll get the chance to earn Bitcoin each cycle for every
        reward slot that you hold.
      </StackingDescription>
      <StackingDescription mt="base">
        The STX required per reward slot can fluctuate from cycle to cycle.If you’re close to the
        current minimum, consider pooling instead to help make sure you don’t end up without
        rewards.
      </StackingDescription>
      <Flex alignItems="baseline">
        <NextCycleStartTime nextCycleStartsIn={timeUntilNextCycle} mt="40px" />
        <EstimatedMinimumLabel
          ml="extra-loose"
          estimatedStackingMinimum={toHumanReadableStx(estimatedStackingMinimum)}
        />
      </Flex>
    </>
  );
};
