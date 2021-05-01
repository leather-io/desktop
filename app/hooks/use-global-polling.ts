import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DEFAULT_POLLING_INTERVAL } from '@constants/index';
import { selectAddress } from '@store/keys';
import {
  fetchBlockTimeInfo,
  fetchCoreDetails,
  fetchStackerInfo,
  fetchStackingInfo,
} from '@store/stacking';
import { getAddressTransactions } from '@store/transaction';
import { getAddressDetails } from '@store/address';
import { useNavigatorOnline } from './use-navigator-online';
import { useInterval } from './use-interval';
import { useApi } from './use-api';

export function useGlobalAppPolling() {
  const dispatch = useDispatch();
  const address = useSelector(selectAddress);
  const api = useApi();

  const initAppWithStxAddressInfo = useCallback(() => {
    if (!address) return;
    dispatch(getAddressTransactions(address));
    dispatch(getAddressDetails(address));
  }, [address, dispatch]);

  const refreshWalletDetailsWithoutLoader = useCallback(() => {
    if (!address) return;
    dispatch(getAddressTransactions(address, { displayLoading: false }));
    dispatch(getAddressDetails(address));
  }, [address, dispatch]);

  useNavigatorOnline({ onReconnect: initAppWithStxAddressInfo });

  useInterval(() => refreshWalletDetailsWithoutLoader(), DEFAULT_POLLING_INTERVAL);

  useEffect(() => {
    initAppWithStxAddressInfo();
    if (address) {
      dispatch(fetchStackingInfo());
      dispatch(fetchCoreDetails());
      dispatch(fetchBlockTimeInfo());
      dispatch(fetchStackerInfo(address));
    }
  }, [address, api, initAppWithStxAddressInfo, dispatch]);

  useInterval(() => {
    if (address) {
      dispatch(fetchStackerInfo(address));
      dispatch(fetchStackingInfo());
    }
    dispatch(fetchCoreDetails());
  }, 20_000);
}
