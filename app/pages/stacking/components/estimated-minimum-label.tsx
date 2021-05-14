import React, { FC } from 'react';
import { color, Flex, FlexProps, Text } from '@stacks/ui';
import { StepsIcon } from '@components/icons/steps';

interface EstimatedMinimumLabelProps extends FlexProps {
  estimatedStackingMinimum: string;
}
export const EstimatedMinimumLabel: FC<EstimatedMinimumLabelProps> = props => {
  const { estimatedStackingMinimum, ...rest } = props;
  return (
    <Flex {...rest}>
      <Flex
        width="44px"
        height="44px"
        background={color('bg-4')}
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
      >
        <StepsIcon size="14px" />
      </Flex>
      <Flex ml="base" flexDirection="column">
        <Text as="h4" display="block" textStyle="body.large.medium" lineHeight="20px">
          Estimated minimum
        </Text>
        <Text
          display="block"
          textStyle="body.large"
          color={color('text-caption')}
          lineHeight="20px"
          mt="extra-tight"
        >
          {estimatedStackingMinimum}
        </Text>
      </Flex>
    </Flex>
  );
};
