import React, { FC } from 'react';
import { Button, ArrowIcon, ButtonProps } from '@blockstack/ui';

interface BackButtonProps extends Omit<ButtonProps, 'children'> {
  backUrl: string | null;
}

export const BackButton: FC<BackButtonProps> = ({ backUrl, ...props }) => {
  return (
    <Button
      cursor="pointer"
      variant="unstyled"
      _hover={{ background: 'none' }}
      position="absolute"
      left={0}
      top="2px"
      isDisabled={backUrl === null}
      {...(props as any)}
    >
      <ArrowIcon cursor="pointer" direction="left" color={backUrl === null ? '#C1C3CC' : 'ink'} />
    </Button>
  );
};
