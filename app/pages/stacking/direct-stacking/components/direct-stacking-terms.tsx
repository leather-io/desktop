import { StackingTermItem } from '../../components/stacking-term';
import { StepsIcon } from '@components/icons/steps';
import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';
import { Text, Stack, StackProps } from '@stacks/ui';
import { IconLock } from '@tabler/icons';
import React, { FC } from 'react';

export const DirectStackingTerms: FC<StackProps> = props => (
  <Stack
    textStyle={['body.small', 'body.large']}
    spacing="base-loose"
    pl="base"
    {...pseudoBorderLeft('feedback-alert')}
    {...props}
  >
    <StackingTermItem title="This transaction can't be reversed" icon={IconLock}>
      <Text>
        STX will be locked in your wallet for your chosen duration, even if an increase in the
        minimum causes you to end up with fewer or no reward slots.
      </Text>
      <Text>There will be no way to unlock your STX before the chosen duration is finished.</Text>
      <Text>
        Nor will you be able to change the entered BTC address. Ensure it&apos;s entered correctly
        and you have control over it.
      </Text>
    </StackingTermItem>
    <StackingTermItem title="Dynamic minimum" icon={StepsIcon}>
      <Text>
        If the minimum increases, you could end up with fewer or no reward slots, even if
        you&apos;ve added a buffer. There will be no way to lock more STX for Stacking with this
        address until the selected duration is finished.
      </Text>
    </StackingTermItem>
  </Stack>
);
