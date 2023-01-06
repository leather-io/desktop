import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { StackingClient } from '@stacks/stacking';

import { RootState } from '@store/index';
import { selectActiveStacksNetwork } from '@store/stacks-node';
import { selectAddress } from '@store/keys';

export function useStackingClient() {
  const { network, address } = useSelector((state: RootState) => ({
    network: selectActiveStacksNetwork(state),
    address: selectAddress(state),
  }));
  const stackingClient = useMemo(
    () => new StackingClient(address || '', network),
    [address, network]
  );

  return { stackingClient };
}
