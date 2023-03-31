import { AddressDisplayer } from './address-displayer';
import { RevealStxPasswordForm } from './reveal-stx-password-form';
import { Flex } from '@stacks/ui';
import React, { FC, useState } from 'react';

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
