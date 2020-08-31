import React, { useCallback, useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigatorOnline } from '../hooks/use-navigator-online';
import { getAddressTransactions } from '../store/transaction';
import { getAddressDetails } from '../store/address/address.actions';
import { RootState } from '../store';
import { selectAddress } from '../store/keys';
import { TitleBar } from '../components/title-bar';

export const App: FC = ({ children }) => {
  const dispatch = useDispatch();

  const { address } = useSelector((state: RootState) => ({
    address: selectAddress(state),
  }));

  const initAppWithStxAddressInfo = useCallback(() => {
    if (!address) return;
    dispatch(getAddressTransactions(address));
    dispatch(getAddressDetails(address));
  }, [address, dispatch]);

  useNavigatorOnline({
    onReconnect: initAppWithStxAddressInfo,
  });

  useEffect(() => {
    initAppWithStxAddressInfo();
  }, [address, initAppWithStxAddressInfo]);

  return (
    <>
      <TitleBar />
      {children}
    </>
  );
};
