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

const emptyInitialState = stacksNodeAdapter.getInitialState({
  selectedApiId: 'default',
});

const stacksNodeSlice = createSlice({
  name: 'stacksNodes',
  initialState: emptyInitialState,
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

const defaultNode: StacksNode = Object.freeze({
  url: 'https://stacks-node-api.krypton.blockstack.org',
  name: 'Blockstack PBC Krypton node',
  id: 'default',
});

const selectStacksNodeState = (state: RootState) => state.stacksNode;
const selectors = stacksNodeAdapter.getSelectors(selectStacksNodeState);
export const selectStacksNodeApis = selectors.selectAll;
export const selectActiveNodeApi = createSelector(
  selectStacksNodeState,
  // coercing type as default node is always selected
  state => {
    if (state.selectedApiId === 'default') return defaultNode;
    return state.entities[state.selectedApiId] as StacksNode;
  }
);
