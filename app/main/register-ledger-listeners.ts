import { ipcMain } from 'electron';
import { BehaviorSubject, Subject, timer, combineLatest, from, of } from 'rxjs';
import { delay, filter, map, switchMap, take } from 'rxjs/operators';
import type Transport from '@ledgerhq/hw-transport';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { safeAwait } from '@blockstack/ui';
import StacksApp, {
  LedgerError,
  ResponseAddress,
  ResponseSign,
  ResponseVersion,
} from '@zondax/ledger-blockstack';

const POLL_LEDGER_INTERVAL = 1_250;
const SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME = 2_000;
const STX_DERIVATION_PATH = `m/44'/5757'/0'/0/0`;

type LedgerEvents =
  | 'create-listener'
  | 'remove-listener'
  | 'waiting-transport'
  | 'disconnected'
  | 'has-transport';

type LedgerStateEvents =
  | Record<'name', LedgerEvents>
  | (Record<'name', keyof typeof LedgerError> & ResponseVersion & { action: 'get-version' });

interface LedgerMessageType {
  type: 'ledger-event';
}

export type LedgerMessageEvents = LedgerStateEvents & LedgerMessageType;

const ledgerState$ = new Subject<LedgerStateEvents>();

const listeningForDevice$ = new BehaviorSubject(false);
ipcMain.on('create-ledger-listener', () => listeningForDevice$.next(true));
ipcMain.on('remove-ledger-listener', () => listeningForDevice$.next(false));

const ledgerDeviceBusy$ = new BehaviorSubject(false);

const transport$ = new BehaviorSubject<Transport | null>(null);

let subscription: null | ReturnType<typeof TransportNodeHid.listen> = null;
function createDeviceListener() {
  if (subscription) subscription.unsubscribe();
  subscription = TransportNodeHid.listen({
    next: async event => {
      if (event.type === 'add') {
        ledgerState$.next({ name: 'waiting-transport' });
        if (subscription) subscription.unsubscribe();
        const [error, ledgerTransport] = await safeAwait(TransportNodeHid.open(event.descriptor));
        ledgerState$.next({ name: 'has-transport' });
        if (ledgerTransport) transport$.next(ledgerTransport);
        if (error) console.log({ error });
      }
    },
    error: e => console.log('err', e),
    complete: () => console.log('complete'),
  });
}

export function registerLedgerListeners(webContent: Electron.WebContents) {
  ledgerState$
    .pipe(map(ledgerEvent => ({ type: 'ledger-event', ...ledgerEvent })))
    .subscribe(event => webContent.send('message-event', event));
}

listeningForDevice$.subscribe(listening => {
  if (listening) {
    createDeviceListener();
    return;
  }
  subscription?.unsubscribe();
  const transport = transport$.getValue();
  if (transport) void transport.close();
});

const ledgerRequestStxAddress = async () => {
  const transport = transport$.getValue();
  if (!transport) throw new Error('No device transport');
  ledgerDeviceBusy$.next(true);
  const stacksApp = new StacksApp(transport);
  const resp = await stacksApp.showAddressAndPubKey(STX_DERIVATION_PATH);
  ledgerDeviceBusy$.next(false);
  if (resp.publicKey) {
    return { ...resp, publicKey: resp.publicKey.toString('hex') };
  }
  return resp as Omit<ResponseAddress, 'publicKey'>;
};
export type LedgerRequestStxAddress = ReturnType<typeof ledgerRequestStxAddress>;
ipcMain.handle('ledger-request-stx-address', ledgerRequestStxAddress);

const ledgerRequestSignTx = async (_: any, unsignedTransaction: string) => {
  const transport = transport$.getValue();
  if (!transport) throw new Error('No device transport');
  ledgerDeviceBusy$.next(true);
  const stacksApp = new StacksApp(transport);
  const txBuffer = Buffer.from(unsignedTransaction, 'hex');
  const signatures: ResponseSign = await stacksApp.sign(STX_DERIVATION_PATH, txBuffer);
  await transport.close();
  ledgerDeviceBusy$.next(false);
  return {
    ...signatures,
    postSignHash: signatures.postSignHash.toString('hex'),
    signatureCompact: signatures.signatureCompact.toString('hex'),
    signatureVRS: signatures.signatureVRS.toString('hex'),
    signatureDER: signatures.signatureDER.toString('hex'),
  };
};

ipcMain.handle('ledger-show-stx-address', async () => {
  const transport = transport$.getValue();
  if (!transport) throw new Error('No device transport');
  ledgerDeviceBusy$.next(true);
  const stacksApp = new StacksApp(transport);
  const resp = await stacksApp.getAddressAndPubKey(STX_DERIVATION_PATH);
  ledgerDeviceBusy$.next(false);
  return resp;
});

export type LedgerRequestSignTx = ReturnType<typeof ledgerRequestSignTx>;
ipcMain.handle('ledger-request-sign-tx', ledgerRequestSignTx);

const shouldPoll$ = combineLatest([listeningForDevice$, ledgerDeviceBusy$]).pipe(
  map(([listeningForDevice, deviceBusy]) => Boolean(listeningForDevice && !deviceBusy))
);

const devicePoll$ = timer(0, POLL_LEDGER_INTERVAL).pipe(
  switchMap(() => shouldPoll$.pipe(take(1))),
  filter(shouldPoll => shouldPoll),
  switchMap(() => {
    const transport = transport$.getValue();
    if (!transport) {
      createDeviceListener();
      return of(true);
    }
    return from(
      new StacksApp(transport as any)
        .getVersion()
        .then(resp => {
          if (resp.returnCode === 0xffff) {
            transport$.next(null);
            checkDisconnect$.next();
            createDeviceListener();
            return;
          }
          ledgerState$.next({
            ...resp,
            action: 'get-version',
            name: LedgerError[resp.returnCode] as keyof typeof LedgerError,
          });
        })
        .catch(console.log)
    );
  })
);

devicePoll$.subscribe();

const checkDisconnect$ = new Subject<void>();

checkDisconnect$
  .pipe(
    delay(SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME),
    switchMap(() => transport$.pipe(take(1)))
  )
  .subscribe(transport => transport === null && ledgerState$.next({ name: 'disconnected' }));
