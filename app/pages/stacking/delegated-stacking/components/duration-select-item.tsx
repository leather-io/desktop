import React, { FC } from 'react';
import { Box, color, Flex, FlexProps, Text } from '@stacks/ui';
import { useFocus } from 'use-events';

type DelegationTypes = 'limited' | 'indefinite';

interface DurationSelectItemProps extends Omit<FlexProps, 'onChange'> {
  title: string;
  delegationType: DelegationTypes;
  activeDelegationType: DelegationTypes | null;
  onChange(duration: DelegationTypes): void;
  icon: JSX.Element;
}

export const DurationSelectItem: FC<DurationSelectItemProps> = props => {
  const { title, icon, delegationType, activeDelegationType, onChange, children, ...rest } = props;
  const [isFocused, bind] = useFocus();
  return (
    <Flex
      minHeight="72px"
      p="base-loose"
      as="label"
      htmlFor={delegationType}
      border={`1px solid ${color('border')}`}
      borderRadius="12px"
      position="relative"
      {...(isFocused
        ? {
            _before: {
              content: '""',
              position: 'absolute',
              top: '-1px',
              left: '-1px',
              right: '-1px',
              bottom: '-1px',
              borderRadius: '12px',
              border: '2px solid #CEDAFA',
            },
          }
        : {})}
      {...rest}
    >
      <Flex width="100%">
        <Box position="relative" top="-3px">
          {icon}
        </Box>
        <Flex ml="base-loose" width="100%" flexDirection={['column', 'row']}>
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
              textStyle="body.small"
              color={color('text-caption')}
              mt="tight"
              display="inline-block"
              lineHeight="18px"
            >
              {children}
            </Text>
          </Box>
        </Flex>
        <Flex ml="loose" alignItems="center">
          <input
            type="radio"
            id={delegationType}
            name="delegationType"
            value={delegationType}
            checked={delegationType === activeDelegationType}
            style={{ transform: 'scale(1.2)', outline: 0 }}
            onChange={e => onChange(e.target.value as DelegationTypes)}
            {...bind}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
