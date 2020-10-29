import { createAsyncThunk } from '@reduxjs/toolkit';

import { selectActiveNodeApi } from '@store/stacks-node/stacks-node.reducer';
import { RootState } from '@store/index';
import { Api } from '@api/api';
import { Pox } from '@utils/stacking/pox';
import { safeAwait } from '@utils/safe-await';

export const fetchStackingInfo = createAsyncThunk('stacking/details', async (_arg, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const network = selectActiveNodeApi(state);
  const resp = await new Api(network.url).getPoxInfo();
  return resp.data;
});

export const fetchCoreDetails = createAsyncThunk(
  'stacking/core-node-details',
  async (_arg, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const network = selectActiveNodeApi(state);
    const resp = await new Api(network.url).getCoreDetails();
    return resp.data;
  }
);
export const fetchBlockTimeInfo = createAsyncThunk(
  'stacking/block-time-details',
  async (_arg, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const network = selectActiveNodeApi(state);
    const resp = await new Api(network.url).getNetworkBlockTimes();
    return resp.data;
  }
);

export const fetchStackerInfo = createAsyncThunk(
  'stacking/stacker-info',
  async (address: string, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const node = selectActiveNodeApi(state);
    const poxClient = new Pox(node.url);
    const [error, resp] = await safeAwait(poxClient.getStackerInfo(address));
    if (error) {
      console.log(error);
      throw error;
    }
    if (resp) return resp;
    return null;
  }
);
