import React, { FC } from 'react';
import { Screen } from '@components/screen';
import { Box, Flex } from '@stacks/ui';

type StackingComponents = 'intro' | 'stackingInfoCard' | 'stackingForm';

type StackingLayoutProps = Record<StackingComponents, JSX.Element>;

export const StackingLayout: FC<StackingLayoutProps> = props => {
  const { intro, stackingInfoCard, stackingForm } = props;
  return (
    <Screen pt="80px" mb="extra-loose">
      <Flex
        flexDirection={['column-reverse', 'column-reverse', 'row']}
        justifyContent="space-between"
      >
        <Box maxWidth={[null, null, '544px']} mr={[null, null, 'extra-loose']}>
          {intro}
          <Box display={['block', null, 'none']} mt="base">
            {stackingInfoCard}
          </Box>
          {stackingForm}
        </Box>
        <Box display={['none', null, 'block']}>{stackingInfoCard}</Box>
      </Flex>
    </Screen>
  );
};
