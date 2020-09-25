import React, { FC } from 'react';

import { ExternalLink } from '@components/external-link';
import { StackingTitle } from './stacking-title';
import { StackingDescription } from './stacking-description';
import { NextCycleInfo } from './next-cycle-info';

export const StackingIntro: FC = () => {
  return (
    <>
      <StackingTitle>Start earning Bitcoin</StackingTitle>
      <StackingDescription mt="base-tight">
        Help secure the Stacks Blockchain and earn Bitcoin by temporarily locking your STX in your
        wallet. Your STX never leave your wallet.
      </StackingDescription>
      <ExternalLink href="https://blockstack.org" mt="base">
        How it works
      </ExternalLink>
      <NextCycleInfo mt="loose" />
    </>
  );
};
