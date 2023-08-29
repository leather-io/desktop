import { BrowserWindow, TouchBar } from 'electron';

const { TouchBarLabel } = TouchBar;

const stxTouchBarButton = new TouchBarLabel({
  label: 'Leather',
});

const touchBar = new TouchBar({
  items: [stxTouchBarButton],
});

export function addMacOsTouchBarMenu(window: BrowserWindow) {
  window.setTouchBar(touchBar);
}
