import { Menu, ipcMain, clipboard, BrowserWindow } from 'electron';

export function registerIpcContextMenuHandlers(window: BrowserWindow) {
  //
  // TODO: refactor to be more generic
  // There's a bug where click handler doesn't fire for the top-level menu
  ipcMain.on(
    'context-menu-open',
    (
      _e,
      args: { menuItems: { menu: Electron.MenuItemConstructorOptions; textToCopy?: string }[] }
    ) => {
      const copyMenu = args.menuItems.map(item => {
        const newItem = { ...item };
        if (newItem.textToCopy) {
          newItem.menu.click = () => clipboard.writeText(newItem.textToCopy as any);
        }
        return newItem.menu;
      });
      const contextMenu = Menu.buildFromTemplate(copyMenu);
      const win = window.getParentWindow();
      if (win) contextMenu.popup({ window: win });
    }
  );
}
