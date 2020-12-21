import { useState, useEffect, useCallback } from 'react';

import { WindowActiveState } from 'app/types';

export function useWindowFocus() {
  const [windowState, setWindowState] = useState<WindowActiveState>('focused');
  const focusHandler = useCallback(() => setWindowState('focused'), []);
  const blurHandler = useCallback(() => setWindowState('blurred'), []);
  useEffect(() => {
    const removeBlurListener = api.windowEvents.blur(blurHandler);
    const removeFocusListener = api.windowEvents.focus(focusHandler);
    return () => {
      removeBlurListener();
      removeFocusListener();
    };
  }, [blurHandler, focusHandler]);
  return windowState;
}
