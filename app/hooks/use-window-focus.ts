import { remote } from 'electron';
import { useState, useEffect } from 'react';

export type WindowActiveState = 'focused' | 'blurred';

export function useWindowFocus() {
  const [win] = remote.BrowserWindow.getAllWindows();
  const [windowState, setWindowState] = useState<WindowActiveState>(
    win.isFocused() ? 'focused' : 'blurred'
  );
  useEffect(() => {
    const focusHandler = () => setWindowState('focused');
    const blurHandler = () => setWindowState('blurred');
    win.on('focus', focusHandler);
    win.on('blur', blurHandler);
    return () => {
      win.removeListener('focus', focusHandler);
      win.removeListener('blur', blurHandler);
    };
  }, [win]);
  return windowState;
}
