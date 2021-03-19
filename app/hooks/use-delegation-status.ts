import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { cvToString, hexToCV, ClarityType, cvToJSON } from '@stacks/transactions';

import { selectAddress } from '@store/keys';
import { RootState } from '@store/index';
import { selectPoxInfo } from '@store/stacking';

import { useFetchDelegationStatus } from './use-fetch-delegation-status';
import { selectCoreNodeInfo } from '../store/stacking/stacking.reducer';

interface DelegatedTrueStatus {
  delegated: true;
  amountMicroStx: BigNumber;
  untilBurnHeight: BigNumber;
  deadDelegation: boolean;
  delegatedTo: string;
  refetch(): Promise<any>;
}

interface DelegatedFalseStatus {
  delegated: false;
  refetch(): Promise<any>;
}

type DelegatedStatus = DelegatedTrueStatus | DelegatedFalseStatus;

export function useDelegationStatus(): DelegatedStatus {
  const { poxInfo, coreInfo, address } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
    coreInfo: selectCoreNodeInfo(state),
    address: selectAddress(state),
  }));

  const { delegationStatus, refetch } = useFetchDelegationStatus(poxInfo?.contract_id, address);

  if (!delegationStatus || !delegationStatus?.data) return { delegated: false, refetch };
  const resp = hexToCV(delegationStatus.data);
  if (resp.type === ClarityType.OptionalSome && resp.value.type === ClarityType.Tuple) {
    const data = resp.value.data;

    const amountMicroStx = BN.isBN((data['amount-ustx'] as any).value)
      ? new BigNumber((data['amount-ustx'] as any).value.toString())
      : new BigNumber(0);

    const untilBurnHeight =
      data['until-burn-ht'].type === ClarityType.OptionalSome
        ? cvToJSON(data['until-burn-ht']).value.value
        : null;

    const deadDelegation =
      untilBurnHeight && coreInfo ? coreInfo.burn_block_height > untilBurnHeight : false;

    return {
      delegated: true,
      amountMicroStx,
      untilBurnHeight,
      deadDelegation,
      delegatedTo: cvToString(data['delegated-to']),
      refetch,
    };
  }
  return { delegated: false, refetch };
}
