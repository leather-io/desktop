// import { remote } from 'electron';
import { useState, useEffect, useCallback } from 'react';

export type WindowActiveState = 'focused' | 'blurred';

export function useWindowFocus() {
  // const [win] = remote.BrowserWindow.getAllWindows();
  // const [windowState, setWindowState] = useState<WindowActiveState>(
  //   win.isFocused() ? 'focused' : 'blurred'
  // );
  // const focusHandler = useCallback(() => setWindowState('focused'), []);
  // const blurHandler = useCallback(() => setWindowState('blurred'), []);
  // useEffect(() => {
  //   win.on('focus', focusHandler);
  //   win.on('blur', blurHandler);
  //   window.addEventListener('beforeunload', () => {
  //     win.removeListener('focus', focusHandler);
  //     win.removeListener('blur', blurHandler);
  //   });
  //   return () => {
  //     win.removeListener('focus', focusHandler);
  //     win.removeListener('blur', blurHandler);
  //   };
  // }, [blurHandler, focusHandler, win]);
  // return windowState;
}
