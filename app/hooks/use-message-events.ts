import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';

export const messages$ = new Subject<any>();

const handler = (e: MessageEvent) => {
  if (e.origin !== 'file://' && e.source !== window) return;
  messages$.next(e.data);
};
window.addEventListener('message', handler);

export function useMessageEvents() {
  const [message, setMessage] = useState<unknown>();
  useEffect(() => {
    const sub = messages$.subscribe(message => setMessage(message));
    return sub.unsubscribe;
  }, []);
  return { message };
}
