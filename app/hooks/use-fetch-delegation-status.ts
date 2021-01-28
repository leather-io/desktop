import { useCallback } from 'react';
import useSWR from 'swr';
import { cvToHex, standardPrincipalCV, tupleCV } from '@stacks/transactions';

import { useApi } from './use-api';

export function useFetchDelegationStatus(contractId?: string, address?: string) {
  const api = useApi();

  const delegationFetcher = useCallback(
    (_, contractId, address) => {
      if (!contractId || !address) throw new Error('values not defined');
      const [contractAddress, contractName] = contractId.split('.');
      const key = cvToHex(
        tupleCV({
          stacker: standardPrincipalCV(address),
        })
      );
      return api.getContractDataMapEntry({
        contractAddress,
        contractName,
        key,
        mapName: 'delegation-state',
      });
    },
    [api]
  );
  const { data: delegationStatus, mutate } = useSWR(
    ['delegation-status', contractId, address],
    delegationFetcher
  );
  return { delegationStatus, mutate };
}
