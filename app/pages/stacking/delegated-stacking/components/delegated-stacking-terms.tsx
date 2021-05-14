import React, { FC } from 'react';
import type { StackProps } from '@stacks/ui';
import { IconClock, IconLock } from '@tabler/icons';
import { Stack } from '@stacks/ui';

import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';
import { StackingTermItem } from '../../components/stacking-term';
import { StepsIcon } from '@components/icons/steps';

export const DelegatedStackingTerms: FC<StackProps> = props => (
  <Stack
    textStyle={['body.small', 'body.large']}
    spacing="base-loose"
    pl="base"
    {...pseudoBorderLeft('feedback-alert')}
    {...props}
  >
    <StackingTermItem title="This transaction can’t be reversed" icon={IconLock}>
      There will be no way to unlock your STX once the pool has started stacking them. You will need
      to wait until they unlock at the end of the pool's chosen number of cycles.
    </StackingTermItem>
    <StackingTermItem title="Consider the following cooldown cycle" icon={IconClock}>
      After you’ve finished pooling, you’ll have to wait one cycle before stacking or pooling with
      your STX address again.
    </StackingTermItem>
    <StackingTermItem title="Research your pool" icon={StepsIcon}>
      Paying out rewards is at the discretion of the pool. Make sure you’ve researched and trust the
      pool you’re using. All pools are unaffiliated with Hiro PBC.
    </StackingTermItem>
  </Stack>
);
