import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { StackingClient } from '@stacks/stacking';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

import { NETWORK } from '@constants/index';
import { selectActiveNodeApi } from '@store/stacks-node/stacks-node.reducer';
import { RootState } from '@store/index';
import { Api } from '@api/api';
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
    const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
    network.coreApiUrl = node.url;
    const stackingClient = new StackingClient(address, network as any);
    const [error, resp] = await safeAwait(stackingClient.getStatus());
    if (resp) return resp;
    if (error) return { error };
    throw new Error();
  }
);

export const activeStackingTx = createAction<{ txId: string }>(
  'stacking/call-stacking-contract-tx'
);

export const removeStackingTx = createAction('stacking/remove-active-tx');
