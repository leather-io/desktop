import { safeAwait } from '@blockstack/ui';
import { Api } from '@api/api';
import { delay } from '@utils/delay';
interface WatchForNewTxAppearArgs {
  nodeUrl: string;
  txId: string;
}

export function watchForNewTxToAppear({ txId, nodeUrl }: WatchForNewTxAppearArgs) {
  let retryCount = 0;
  return new Promise((resolve, reject) => {
    const fetchTx = async (): Promise<void> => {
      console.log('retrying');
      if (retryCount > 5) {
        // In this instance, the API has failed to find the tx, but it could still
        // be pending this absolute delay provides a last ditch effort for it to update
        await delay(2000);
        return reject(false);
      }
      retryCount += 1;

      console.log(retryCount);
      const [error, txResponse] = await safeAwait(new Api(nodeUrl).getTxDetails(txId));

      if (error || !txResponse) return fetchTx();

      const tx = txResponse.data;
      if (tx.tx_status === 'abort_by_response' || tx.tx_status === 'abort_by_post_condition') {
        return reject(false);
      }
      if (tx.tx_status === 'pending' || tx.tx_status === 'success') {
        return resolve(tx);
      }
      return fetchTx();
    };
    void fetchTx();
  });
}
