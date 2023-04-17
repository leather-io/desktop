/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { selectCoreNodeInfo } from '../store/stacking/stacking.reducer';
import { useFetchDelegationStatus } from './use-fetch-delegation-status';
import { cvToString, hexToCV, ClarityType, cvToJSON } from '@stacks/transactions';
import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';
import { selectPoxInfo } from '@store/stacking';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

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

    const ustxAmount = (data['amount-ustx'] as any).value;

    const amountMicroStx = ustxAmount ? new BigNumber(ustxAmount) : new BigNumber(0);

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
