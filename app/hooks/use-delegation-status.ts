import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import { mutate } from 'swr';
import BN from 'bn.js';
import { cvToString, hexToCV, ClarityType } from '@stacks/transactions';

import { selectAddress } from '@store/keys';
import { RootState } from '@store/index';
import { selectPoxInfo } from '@store/stacking';

import { useFetchDelegationStatus } from './use-fetch-delegation-status';

interface DelegatedTrueStatus {
  delegated: true;
  amountMicroStx: BigNumber;
  update(): Promise<void>;
  delegatedTo: string;
}

interface DelegatedFalseStatus {
  delegated: false;
  update(): Promise<void>;
}

type DelegatedStatus = DelegatedTrueStatus | DelegatedFalseStatus;

export function useDelegationStatus(): DelegatedStatus {
  const { poxInfo, address } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
    address: selectAddress(state),
  }));

  const { delegationStatus } = useFetchDelegationStatus(poxInfo?.contract_id, address);

  const update = useCallback(() => mutate(['delegation-status', poxInfo?.contract_id, address]), [
    poxInfo?.contract_id,
    address,
  ]);

  if (!delegationStatus || !delegationStatus?.data) return { delegated: false, update };
  const resp = hexToCV(delegationStatus.data);
  if (resp.type === ClarityType.OptionalSome && resp.value.type === ClarityType.Tuple) {
    const data = resp.value.data;
    const amountMicroStx = BN.isBN((data['amount-ustx'] as any).value)
      ? new BigNumber((data['amount-ustx'] as any).value.toString())
      : new BigNumber(0);

    return {
      delegated: true,
      amountMicroStx,
      delegatedTo: cvToString(data['delegated-to']),
      update,
    };
  }
  return { delegated: false, update };
}
