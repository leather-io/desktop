import React, { FC } from 'react';
import type { StackProps } from '@stacks/ui';
import { ExclamationMarkCircleIcon, Stack } from '@stacks/ui';
import { ClockIcon } from '@components/icons/clock';
import { DelegationIcon } from '@components/icons/delegation-icon';

import { StackingTermItem } from '../../components/stacking-term';
import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';

export const DelegatedStackingTerms: FC<StackProps> = props => (
  <Stack
    textStyle={['body.small', 'body.large']}
    spacing="base-loose"
    pl="base"
    {...pseudoBorderLeft('feedback-alert')}
    {...props}
  >
    <StackingTermItem title="This transaction can’t be reversed" icon={DelegationIcon}>
      There will be no way to unlock your STX once the pool has started stacking them. You will need
      to wait until they unlock at the end of the pool's chosen number of cycles.
    </StackingTermItem>
    <StackingTermItem title="Consider the following cooldown cycle" icon={ClockIcon}>
      After you’ve finished pooling, you’ll have to wait one cycle before stacking or pooling with
      your STX address again.
    </StackingTermItem>
    <StackingTermItem title="Research your pool" icon={ExclamationMarkCircleIcon}>
      Paying out rewards is at the discretion of the pool. Make sure you’ve researched and trust the
      pool you’re using. All pools are unaffiliated with Hiro PBC.
    </StackingTermItem>
  </Stack>
);
