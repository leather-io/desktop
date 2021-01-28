import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { StackingClient } from '@stacks/stacking';

import { stacksNetwork } from 'app/environment';
import { RootState } from '@store/index';
import { selectActiveNodeApi } from '@store/stacks-node';
import { selectAddress } from '@store/keys';

export function useStackingClient() {
  const { node, address } = useSelector((state: RootState) => ({
    node: selectActiveNodeApi(state),
    address: selectAddress(state),
  }));
  const stackingClient = useMemo(() => {
    const network = stacksNetwork;
    network.coreApiUrl = node.url;
    return new StackingClient(address || '', network as any);
  }, [node.url, address]);

  return { stackingClient };
}
