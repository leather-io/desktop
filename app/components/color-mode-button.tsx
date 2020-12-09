import React, { forwardRef, memo, Ref } from 'react';
import { BoxProps, IconButton, useColorMode, color } from '@stacks/ui';
import { IconSun, IconSunOff } from '@tabler/icons';

export const ColorModeButton = memo(
  forwardRef((props: BoxProps, ref: Ref<HTMLDivElement>) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const Icon = colorMode === 'light' ? IconSun : IconSunOff;
    return (
      <IconButton
        icon={Icon}
        size="24px"
        iconSize="14px"
        onClick={toggleColorMode}
        title="Toggle color mode"
        {...(props as any)}
        ref={ref as any}
        color={color('text-caption')}
      />
    );
  })
);
