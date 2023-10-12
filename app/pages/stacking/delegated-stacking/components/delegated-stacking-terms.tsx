import { StackingTermItem } from '../../components/stacking-term';
import { StepsIcon } from '@components/icons/steps';
import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';
import type { StackProps } from '@stacks/ui';
import { Stack } from '@stacks/ui';
import { IconLock } from '@tabler/icons';
import React, { FC } from 'react';

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
      to wait until they unlock at the end of the pool&apos;s chosen number of cycles.
    </StackingTermItem>
    <StackingTermItem title="Research your pool" icon={StepsIcon}>
      Paying out rewards is at the discretion of the pool. Make sure you&apos;ve researched and
      trust the pool you’re using. All pools are unaffiliated with Leather.
    </StackingTermItem>
  </Stack>
);
