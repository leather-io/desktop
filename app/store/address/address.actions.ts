import { Dispatch } from '../index';
import { createAction } from '@reduxjs/toolkit';
import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { safeAwait } from '@blockstack/ui';

import { Api } from '../../api/api';

export const fetchAddress = createAction('address/fetch-address');
export const fetchAddressDone = createAction<AddressBalanceResponse>('address/fetch-address-done');
export const fetchAddressFail = createAction('address/fetch-address-fail');

export function getAddressDetails(address: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAddress());
    const [error, response] = await safeAwait(Api.getAddressBalance(address));
    if (error) {
      dispatch(fetchAddressFail());
      return;
    }
    if (response) {
      const address = response.data;
      dispatch(fetchAddressDone(address));
    }
  };
}

export const updateAddressBalance = createAction<{ address: string; balance: string }>(
  'address/update-balance'
);
