import React, { FC } from 'react';
import { Box, BoxProps, color } from '@stacks/ui';

interface StackingUserConfirmProps extends Omit<BoxProps, 'onChange'> {
  onChange(userConfirmed: boolean): void;
}

export const StackingUserConfirm: FC<StackingUserConfirmProps> = props => {
  const { onChange, ...rest } = props;
  return (
    <Box
      as="label"
      display="block"
      py="base"
      textStyle="body.small"
      color={color('text-caption')}
      userSelect="none"
      {...rest}
    >
      <Box mr="base-tight" display="inline-block">
        <input type="checkbox" onChange={e => onChange(e.target.checked)} />
      </Box>
      I have read and understand the above
    </Box>
  );
};
