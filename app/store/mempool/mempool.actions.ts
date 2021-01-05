import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@store/index';
import { selectActiveNodeApi } from '@store/stacks-node';
import { Api } from '@api/api';
import { selectAddress } from '../keys/keys.reducer';

export const fetchMempoolTxs = createAsyncThunk('mempool-transactions', async (_args, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const network = selectActiveNodeApi(state);
  const address = selectAddress(state);
  const results = await new Api(network.url).getMempoolTransactions();
  // return filteredResults(results, address);
});
