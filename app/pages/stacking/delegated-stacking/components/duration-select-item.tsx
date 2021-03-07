import React, { FC } from 'react';
import { Box, Flex, Text } from '@blockstack/ui';

interface DurationSelectItemProps {
  title: string;
  durationType: -1 | 1;
  duration: number;
  activeDuration: number;
  index: number;
  onChange(duration: number): void;
}

export const DurationSelectItem: FC<DurationSelectItemProps> = props => {
  const { title, durationType, duration, activeDuration, index, onChange, children } = props;
  const isActiveDuration = () => Math.abs(activeDuration) === Math.abs(durationType);
  return (
    <Flex minHeight="72px" p="base" as="label" borderTop={index > 0 ? '1px solid #F0F0F5' : null}>
      <Flex width="100%" align-items="stretch">
        <Box position="relative" top="-3px">
          <input
            type="radio"
            id={index.toString()}
            name="select-duration"
            value={duration}
            checked={isActiveDuration()}
            onChange={() => onChange(duration)}
          />
        </Box>
        <Flex ml="base-tight" width="100%" flexDirection={['column', 'row']}>
          <Box>
            <Text
              textStyle="body.small"
              fontWeight={500}
              display="block"
              style={{ wordBreak: 'break-all' }}
            >
              {title}
            </Text>
            {children}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
