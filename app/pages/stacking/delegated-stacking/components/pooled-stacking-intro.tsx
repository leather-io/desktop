import React, { FC } from 'react';
import { Title } from '@components/title';
import { NextCycleStartTime } from '../../components/next-cycle-start-time';

export const PooledStackingIntro: FC = () => (
  <>
    <Title>Stack in a pool</Title>
    <NextCycleStartTime mt="extra-loose" nextCycleStartsIn="11 hours" />
  </>
);
