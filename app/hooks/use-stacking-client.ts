import { StackingClient } from '@stacks/stacking';
import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';
import { selectActiveStacksNetwork } from '@store/stacks-node';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

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
