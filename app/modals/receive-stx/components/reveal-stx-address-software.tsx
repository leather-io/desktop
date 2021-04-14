import React, { FC, useState } from 'react';
import { Flex } from '@stacks/ui';

import { AddressDisplayer } from './address-displayer';
import { RevealStxPasswordForm } from './reveal-stx-password-form';

export const RevealStxAddressSoftware: FC = () => {
  const [address, setAddress] = useState<null | string>(null);

  return (
    <Flex flexDirection="column" mb="extra-loose" mx="extra-loose">
      {address === null ? (
        <RevealStxPasswordForm onAddressDerived={address => setAddress(address)} />
      ) : (
        <AddressDisplayer address={address} />
      )}
    </Flex>
  );
};
