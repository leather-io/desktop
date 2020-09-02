import { Dispatch, GetState } from '../index';
import { createAction } from '@reduxjs/toolkit';
import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { safeAwait } from '@blockstack/ui';

import { Api } from '../../api/api';
import { selectActiveNodeApi } from '../stacks-node/stacks-node.reducer';

export const fetchAddress = createAction('address/fetch-address');
export const fetchAddressDone = createAction<AddressBalanceResponse>('address/fetch-address-done');
export const fetchAddressFail = createAction('address/fetch-address-fail');

export function getAddressDetails(address: string) {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch(fetchAddress());
    const activeNode = selectActiveNodeApi(getState());
    const [error, response] = await safeAwait(new Api(activeNode.url).getAddressBalance(address));
    if (error) {
      dispatch(fetchAddressFail());
      return;
    }
    if (response) {
      dispatch(fetchAddressDone(response.data));
    }
  };
}

export const updateAddressBalance = createAction<{ address: string; balance: string }>(
  'address/update-balance'
);
