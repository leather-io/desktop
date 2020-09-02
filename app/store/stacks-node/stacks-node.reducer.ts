import {
  createEntityAdapter,
  EntityState,
  createSlice,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';

import { RootState } from '..';

export interface StacksNode {
  url: string;
  name: string;
  id: string;
}

export interface StacksNodeState extends EntityState<StacksNode> {
  selectedApiId: string;
}

const stacksNodeAdapter = createEntityAdapter<StacksNode>();

const defaultNode: StacksNode = {
  url: 'https://stacks-node-api-latest.argon.blockstack.xyz/extended',
  name: 'Blockstack PBC node',
  id: 'default',
};
const emptyInitialState = stacksNodeAdapter.getInitialState({
  selectedApiId: 'default',
});
const includesPbcDefaultNodeApi = stacksNodeAdapter.addOne(emptyInitialState, defaultNode);

const stacksNodeSlice = createSlice({
  name: 'stacksNodes',
  initialState: includesPbcDefaultNodeApi,
  reducers: {
    upsertStacksNodeApi: stacksNodeAdapter.upsertOne,
    removeStacksNodeApi: (state, action) => ({
      ...stacksNodeAdapter.removeOne({ ...state, selectedApiId: 'default' }, action),
    }),
    setActiveStacksNode: (state, action: PayloadAction<string>) => ({
      ...state,
      selectedApiId: action.payload,
    }),
  },
});

export const stacksNodeReducer = stacksNodeSlice.reducer;

export const upsertStacksNodeApi = stacksNodeSlice.actions.upsertStacksNodeApi;
export const removeStacksNodeApi = stacksNodeSlice.actions.removeStacksNodeApi;
export const setActiveStacksNode = stacksNodeSlice.actions.setActiveStacksNode;

const selectStacksNodeState = (state: RootState) => state.stacksNode;
const selectors = stacksNodeAdapter.getSelectors(selectStacksNodeState);
export const selectStacksNodeApis = selectors.selectAll;
export const selectActiveNodeApi = createSelector(
  selectStacksNodeState,
  // coercing type as default node is always selected
  state => state.entities[state.selectedApiId] as StacksNode
);
