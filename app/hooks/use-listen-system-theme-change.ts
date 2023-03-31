import { messages$ } from './use-message-events';
import { useColorMode } from '@stacks/ui';
import { useEffect } from 'react';
import { filter } from 'rxjs/operators';

export function useListenSystemThemeChange() {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    const sub = messages$.pipe(filter(e => e.type === 'theme-event')).subscribe(e => {
      setColorMode(e.shouldUseDarkMode ? 'dark' : 'light');
    });
    return () => sub.unsubscribe();
  }, [setColorMode]);
}
