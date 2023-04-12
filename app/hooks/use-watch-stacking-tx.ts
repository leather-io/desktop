import { useApi } from './use-api';
import { watchContractExecution } from '@api/watch-contract-execution';
import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';
import {
  selectActiveStackingTxId,
  selectPoxInfo,
  fetchStackerInfo,
  removeStackingTx,
  fetchAccountBalanceLocked,
} from '@store/stacking';
import { safeAwait } from '@utils/safe-await';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useWatchStackingTx() {
  const api = useApi();
  const dispatch = useDispatch();

  const { address, activeStackingTx } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    activeStackingTx: selectActiveStackingTxId(state),
    poxInfo: selectPoxInfo(state),
  }));

  useEffect(() => {
    async function run() {
      if (!activeStackingTx || !address) return;
      await safeAwait(watchContractExecution({ nodeUrl: api.baseUrl, txId: activeStackingTx }));
      dispatch(fetchStackerInfo(address));
      dispatch(fetchAccountBalanceLocked(address));
      setTimeout(() => dispatch(removeStackingTx()), 2000);
    }
    void run();
  }, [activeStackingTx, address, api.baseUrl, dispatch]);
}
