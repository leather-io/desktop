import { useState, useEffect, useCallback } from 'react';

import { WindowActiveState } from '@models';

export function useWindowFocus() {
  const [windowState, setWindowState] = useState<WindowActiveState>('focused');
  const focusHandler = useCallback(() => setWindowState('focused'), []);
  const blurHandler = useCallback(() => setWindowState('blurred'), []);
  useEffect(() => {
    const removeBlurListener = main.windowEvents.blur(blurHandler);
    const removeFocusListener = main.windowEvents.focus(focusHandler);
    return () => {
      removeBlurListener();
      removeFocusListener();
    };
  }, [blurHandler, focusHandler]);
  return windowState;
}
