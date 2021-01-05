import React, { FC } from 'react';

import { Flex, Text, BoxProps } from '@blockstack/ui';
import { UpdateArrowIcon } from '@components/icons/update-arrow';
import { WindowActiveState } from 'app/types';

interface UpdateAvailableButtonProps extends BoxProps {
  windowState: WindowActiveState;
}

export const UpdateAvailableButton: FC<UpdateAvailableButtonProps> = props => {
  const { windowState, ...rest } = props;
  return (
    <Flex alignItems="center" {...rest}>
      <UpdateArrowIcon color={windowState === 'blurred' ? '#A1A7B3' : 'blue'} />
      <Text
        textStyle="body.small.medium"
        ml="tight"
        color={windowState === 'blurred' ? '#A1A7B3' : 'blue'}
      >
        Update available
      </Text>
    </Flex>
  );
};
