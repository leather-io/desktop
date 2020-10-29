import { useEffect, useState } from 'react';

const state = {
  whenOnline: 'online',
  whenOffline: 'offline',
};

interface UseNavigatorOnlineArgs {
  onReconnect?(): void;
  onDisconnect?(): void;
}

// Credit to https://github.com/oieduardorabelo/use-navigator-online
export function useNavigatorOnline({ onReconnect, onDisconnect }: UseNavigatorOnlineArgs = {}) {
  const [value, setValue] = useState(window.navigator.onLine);

  useEffect(() => {
    function handleOnlineStatus() {
      const newState = window.navigator.onLine;
      setValue(newState);
      if (newState) onReconnect?.();
      if (!newState) onDisconnect?.();
    }

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [onDisconnect, onReconnect]);

  const isOnline = value === true;
  const isOffline = value === false;
  const status = isOnline ? state.whenOnline : state.whenOffline;

  return { status, isOnline, isOffline };
}
