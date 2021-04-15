import { ipcMain } from 'electron';
import { BehaviorSubject, Subject, timer, combineLatest, from, of } from 'rxjs';
import { delay, filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import type Transport from '@ledgerhq/hw-transport';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { safeAwait } from '@blockstack/ui';
import StacksApp, { LedgerError, ResponseVersion } from '@zondax/ledger-blockstack';
import {
  ledgerRequestSignTx,
  ledgerRequestStxAddress,
  ledgerShowStxAddress,
} from './ledger-actions';

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

const POLL_LEDGER_INTERVAL = 1_250;
const SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME = 2_000;

const ledgerState$ = new Subject<LedgerStateEvents>();
const ledgerDeviceBusy$ = new BehaviorSubject(false);
const listeningForDevice$ = new BehaviorSubject(false);
const checkDisconnect$ = new Subject<void>();

const transport$ = new BehaviorSubject<Transport | null>(null);

export function registerLedgerListeners(webContent: Electron.WebContents) {
  // `webContent` might be destroyed when closing window
  // listenUntil$ tears down the old subscriptoin
  const listenUntil$ = new Subject<void>();
  webContent.on('destroyed', () => {
    listeningForDevice$.next(false);
    listenUntil$.next();
    listenUntil$.complete();
  });
  ledgerState$
    .pipe(
      takeUntil(listenUntil$),
      map(ledgerEvent => ({ type: 'ledger-event', ...ledgerEvent }))
    )
    .subscribe(event => webContent.send('message-event', event));
}

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

listeningForDevice$.subscribe(listening => {
  if (listening) {
    createDeviceListener();
    return;
  }
  subscription?.unsubscribe();
  const transport = transport$.getValue();
  if (transport) void transport.close();
});

const shouldPoll$ = combineLatest([listeningForDevice$, ledgerDeviceBusy$]).pipe(
  map(([listeningForDevice, deviceBusy]) => Boolean(listeningForDevice && !deviceBusy))
);

//
// Ledger devices do not immediately fire updates, such as if
// the device disconnects or jumps to another state. In order
// to get the latest state, we poll the device, but only in
// certain circumstances. This stream emits with an interval
// and is then filtered based on the value of these conditions.
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

//
// When jumping between screens on a Ledger device,
// it technically disconnects/reconnects very quickly.
// To detect real device unplugs we watch to see if
// if a transport exists after a set period
checkDisconnect$
  .pipe(
    delay(SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME),
    switchMap(() => transport$.pipe(take(1)))
  )
  .subscribe(transport => transport === null && ledgerState$.next({ name: 'disconnected' }));

async function wrapAsBusy<T>(ledgerOperation: Promise<T>) {
  ledgerDeviceBusy$.next(true);
  const resp = await ledgerOperation;
  ledgerDeviceBusy$.next(false);
  return resp;
}

//
// Request ledger stx address
const wrappedLedgerRequestStxAddress = () =>
  wrapAsBusy(ledgerRequestStxAddress(transport$.getValue()));

export type LedgerRequestStxAddress = ReturnType<typeof ledgerRequestStxAddress>;
ipcMain.handle('ledger-request-stx-address', async () => wrappedLedgerRequestStxAddress());

//
// Show ledger stx address
const wrappedShowLedgerStxAddress = () => wrapAsBusy(ledgerShowStxAddress(transport$.getValue()));
ipcMain.handle('ledger-show-stx-address', async () => wrappedShowLedgerStxAddress());

//
// Sign ledger transaction
export type LedgerRequestSignTx = ReturnType<ReturnType<typeof ledgerRequestSignTx>>;

const wrappedLedgerRequestSignTx = (unsignedTx: string) =>
  wrapAsBusy(ledgerRequestSignTx(transport$.getValue())(unsignedTx));

ipcMain.handle('ledger-request-sign-tx', async (_, unsignedTx: string) =>
  wrappedLedgerRequestSignTx(unsignedTx)
);

ipcMain.on('create-ledger-listener', () => listeningForDevice$.next(true));
ipcMain.on('remove-ledger-listener', () => listeningForDevice$.next(false));
