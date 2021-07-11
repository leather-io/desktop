import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { ApiResource } from '@models';
import { selectAddress } from '@store/keys';
import { useApi } from '@hooks/use-api';

export function useFetchPossibleNextNonce() {
  const api = useApi();
  const address = useSelector(selectAddress);

  const nonceFetcher = useCallback(
    ({ queryKey }) => {
      const [_, innerAddress] = queryKey;
      if (!innerAddress) return;
      return api.getNonce(innerAddress);
    },
    [api]
  );
  const { data } = useQuery([ApiResource.Nonce, address], nonceFetcher);
  if (!data) return { nonce: 0 };
  return { nonce: data.possible_next_nonce };
}
