import { NextCycleStartTime } from '../../components/next-cycle-start-time';
import { Title } from '@components/title';
import React, { FC } from 'react';

interface PooledIntroProps {
  timeUntilNextCycle: string;
}
export const PooledStackingIntro: FC<PooledIntroProps> = ({ timeUntilNextCycle }) => (
  <>
    <Title>Stack in a pool</Title>
    <NextCycleStartTime mt="extra-loose" nextCycleStartsIn={timeUntilNextCycle} />
  </>
);
