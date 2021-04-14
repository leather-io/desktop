import React, { FC } from 'react';
import { Box, Flex, Text } from '@stacks/ui';

type DelegationTypes = 'limited' | 'indefinite';

interface DurationSelectItemProps {
  title: string;
  delegationType: DelegationTypes;
  activeDelegationType: DelegationTypes | null;
  onChange(duration: DelegationTypes): void;
  isFirst?: boolean;
}

export const DurationSelectItem: FC<DurationSelectItemProps> = props => {
  const { title, isFirst, delegationType, activeDelegationType, onChange, children } = props;
  return (
    <Flex minHeight="72px" p="base" as="label" borderTop={!isFirst ? '1px solid #F0F0F5' : null}>
      <Flex width="100%">
        <Box position="relative" top="-3px">
          <input
            type="radio"
            name="delegationType"
            value={delegationType}
            checked={delegationType === activeDelegationType}
            onChange={e => onChange(e.target.value as DelegationTypes)}
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
            <Text
              textStyle="caption"
              color="ink.600"
              mt="tight"
              display="inline-block"
              lineHeight="18px"
            >
              {children}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
