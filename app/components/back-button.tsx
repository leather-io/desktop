import React, { FC } from 'react';
import { Box, ArrowIcon, ButtonProps, IconButton, color } from '@stacks/ui';
import { useBackButtonState } from '@hooks/use-back-url';

interface BackButtonProps extends Omit<ButtonProps, 'children'> {
  hasFocus: boolean;
}

// Cannot use cursor pointer in top bar area of window
// https://github.com/electron/electron/issues/5723
export const BackButton: FC<BackButtonProps> = ({ hasFocus, ...props }) => {
  const { backUrl } = useBackButtonState();
  return !backUrl ? (
    <Box />
  ) : (
    <IconButton
      position="relative"
      zIndex={99}
      size="24px"
      cursor="unset !important"
      {...(props as any)}
      color={color('text-caption')}
      icon={(p: any) => <ArrowIcon direction={'left' as any} {...p} size="12px" />}
    />
  );
};
