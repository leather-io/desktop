import React, { cloneElement, FC, isValidElement } from 'react';
import { Box, BoxProps, color, Flex, FlexProps, Stack, StackProps, Text } from '@stacks/ui';
import { ExplainerTooltip } from '@components/tooltip';
import { Hr } from '@components/hr';

export const StackingInfoCard: FC<FlexProps> = props => (
  <Flex
    flexDirection="column"
    boxShadow="low"
    border={`1px solid ${color('border')}`}
    borderRadius="8px"
    minHeight="84px"
    minWidth={[null, null, '320px', '420px']}
    {...props}
  />
);

export const StackingInfoCardGroup: FC<BoxProps> = ({ children, ...props }) => {
  const parsedChildren = Array.isArray(children) ? children : [children];
  const infoGroup = parsedChildren.flatMap((child, index) => {
    if (!isValidElement(child)) return null;
    return [
      cloneElement(child, {
        key: index,
        mb: index === parsedChildren.length ? '280px' : null,
      }),
      index !== parsedChildren.length - 1 && <Hr my="loose" key={index.toString() + '-hr'} />,
    ];
  });
  return <Box {...props}>{infoGroup}</Box>;
};

export const StackingInfoCardSection: FC<StackProps> = ({ children, ...props }) => {
  return (
    <Stack {...props} spacing="base-tight">
      {children}
    </Stack>
  );
};

// export const StackingInfoCardSection: FC<FlexProps> = props => (
//   <Flex flexDirection="column" {...props} />
// );

export const StackingInfoCardRow: FC<FlexProps> = props => (
  <Flex justifyContent="space-between" {...props} />
);

interface StackingInfoCardLabelProps extends FlexProps {
  explainer?: string;
}
export const StackingInfoCardLabel: FC<StackingInfoCardLabelProps> = ({ children, ...props }) => (
  <Flex color={color('text-caption')} alignItems="center" {...props}>
    <Box mr={!!props.explainer ? 'tight' : undefined}>{children}</Box>
    {props.explainer && <ExplainerTooltip>{props.explainer}</ExplainerTooltip>}
  </Flex>
);

export const StackingInfoCardValue: FC<FlexProps> = props => (
  <Text textStyle="body.large.medium" textAlign="right" {...props} />
);
