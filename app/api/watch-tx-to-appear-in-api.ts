import { safeAwait } from '@blockstack/ui';
import { Api } from '@api/api';

interface WatchForNewTxAppearArgs {
  nodeUrl: string;
  txId: string;
}

export function watchForNewTxToAppear({ txId, nodeUrl }: WatchForNewTxAppearArgs) {
  const pollingInterval = 500;
  return new Promise((resolve, reject) => {
    const fetchTx = async (timeoutInterval: number) => {
      const [error, txResponse] = await safeAwait(new Api(nodeUrl).getTxDetails(txId));
      if (!txResponse) return;
      const tx = txResponse.data;

      if (tx.tx_status === 'pending' || tx.tx_status === 'success') {
        clearInterval(timeoutInterval);
        return resolve(tx);
      }

      if (
        error ||
        tx.tx_status === 'abort_by_response' ||
        tx.tx_status === 'abort_by_post_condition'
      ) {
        clearInterval(timeoutInterval);
        return reject(error?.message);
      }
    };
    const interval: number = window.setInterval(() => void fetchTx(interval), pollingInterval);
  });
}
