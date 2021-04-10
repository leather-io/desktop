import { useQuery } from 'react-query';
import { cvToHex, standardPrincipalCV, tupleCV } from '@stacks/transactions';

import { useApi } from './use-api';
import { ApiResource } from '@models';

export function useFetchDelegationStatus(contractId?: string, address?: string) {
  const api = useApi();

  const { data, refetch } = useQuery(
    [ApiResource.DelegationStatus, contractId, address],
    async ({ queryKey }) => {
      const [, innerContractId, innerAddress] = queryKey;
      if (!innerContractId || !innerAddress) return;
      const [contractAddress, contractName] = innerContractId.split('.');
      const key = cvToHex(
        tupleCV({
          stacker: standardPrincipalCV(innerAddress),
        })
      );
      return api.getContractDataMapEntry({
        contractAddress,
        contractName,
        key,
        mapName: 'delegation-state',
      }) as Promise<{ data: string }>;
    },
    {
      refetchInterval: 60_000,
    }
  );
  return { refetch, delegationStatus: data };
}
