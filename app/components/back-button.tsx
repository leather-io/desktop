import React, { FC } from 'react';
import { Button, ArrowIcon, ButtonProps } from '@blockstack/ui';

interface BackButtonProps extends Omit<ButtonProps, 'children'> {
  backUrl: string | null;
}

// Cannot use cursor pointer in top bar area of window
// https://github.com/electron/electron/issues/5723
export const BackButton: FC<BackButtonProps> = ({ backUrl, ...props }) => {
  return (
    <Button
      variant="unstyled"
      _hover={{ background: 'none' }}
      position="absolute"
      left={0}
      top="5px"
      isDisabled={backUrl === null}
      {...(props as any)}
      height="34px"
      width="34px"
      style={{
        cursor: 'default',
        minHeight: 'unset',
        minWidth: 'unset',
        padding: 0,
      }}
    >
      <ArrowIcon direction="left" color={backUrl === null ? '#C1C3CC' : 'ink'} />
    </Button>
  );
};
