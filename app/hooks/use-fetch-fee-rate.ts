import { useMemo } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';

import { ApiResource } from '@models';
import { useApi } from './use-api';

const queryArgs: UseQueryOptions<string, string, number> = {
  refetchInterval: 300_000,
};

export function useFetchFeeRate() {
  const api = useApi();

  const { data: feeRate } = useQuery(
    ApiResource.FeeRate,
    () => api.getFeeRate().then(({ data }) => data),
    queryArgs
  );

  return useMemo(() => ({ feeRate }), [feeRate]);
}
