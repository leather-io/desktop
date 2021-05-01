import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@store/index';
import { watchContractExecution } from '@api/watch-contract-execution';
import { selectAddress } from '@store/keys';
import { safeAwait } from '@utils/safe-await';
import { useApi } from './use-api';
import {
  selectActiveStackingTxId,
  selectPoxInfo,
  fetchStackerInfo,
  removeStackingTx,
} from '@store/stacking';

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
      setTimeout(() => dispatch(removeStackingTx()), 2000);
    }
    void run();
  }, [activeStackingTx, address, api.baseUrl, dispatch]);
}
