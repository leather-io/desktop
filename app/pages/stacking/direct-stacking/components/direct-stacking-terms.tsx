import React, { FC } from 'react';
import { Text, EncryptionIcon, Stack, StackProps } from '@stacks/ui';
import { ClockIcon } from '@components/icons/clock';
import { RewindArrow } from '@components/icons/rewind-arrow';

import { StackingTermItem } from '../../components/stacking-term';
import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';

export const DirectStackingTerms: FC<StackProps> = props => (
  <Stack
    textStyle={['body.small', 'body.large']}
    spacing="base-loose"
    pl="base"
    {...pseudoBorderLeft('feedback-alert')}
    {...props}
  >
    <StackingTermItem title="This transaction can’t be reversed" icon={EncryptionIcon}>
      <Text>
        STX will be locked in your wallet for your chosen duration, even if an increase in the
        minimum causes you to end up with fewer or no reward slots.
      </Text>
      <Text>There will be no way to unlock your STX before the chosen duration is finished.</Text>
      <Text>
        Nor will you be able to change the entered BTC address. Ensure it's entered correctly and
        you have control over it.
      </Text>
    </StackingTermItem>
    <StackingTermItem title="Consider the following cooldown cycle" icon={ClockIcon}>
      <Text>
        After your chosen duration is finished, you have to wait one cycle before you can stack from
        this address again
      </Text>
    </StackingTermItem>
    <StackingTermItem title="Dynamic minimum" icon={RewindArrow}>
      <Text>
        If the minimum increases, you could end up with fewer or no reward slots, even if you’ve
        added a buffer. There will be no way to lock more STX for Stacking with this address until
        the selected duration is finished.
      </Text>
    </StackingTermItem>
  </Stack>
);
