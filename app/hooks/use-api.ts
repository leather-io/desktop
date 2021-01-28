import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Api } from '@api/api';
import { RootState } from '@store/index';
import { selectActiveNodeApi } from '@store/stacks-node';

export function useApi() {
  const { activeNode } = useSelector((state: RootState) => ({
    activeNode: selectActiveNodeApi(state),
  }));
  return useMemo(() => new Api(activeNode.url), [activeNode.url]);
}
