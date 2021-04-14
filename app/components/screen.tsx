import React, { FC } from 'react';
import { Flex, FlexProps } from '@stacks/ui';

type ScreenProps = FlexProps;

export const Screen: FC<ScreenProps> = props => (
  <Flex
    flexDirection="column"
    maxWidth="1216px"
    mb="extra-loose"
    mx={['loose', 'loose', 'extra-loose', 'extra-loose', 'auto']}
    {...props}
  />
);
