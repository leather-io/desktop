import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { ApiResource } from '@models';
import { selectAddress } from '@store/keys';
import { useApi } from '@hooks/use-api';

export function useFetchAccountNonce() {
  const api = useApi();
  const address = useSelector(selectAddress);

  const nonceFetcher = useCallback(() => api.getNonce(address || ''), [api, address]);
  const { data } = useQuery(ApiResource.Nonce, nonceFetcher);
  if (!data) return {};
  return data;
}
