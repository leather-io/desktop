import * as configureStoreDev from './configureStore.dev';
import * as configureStoreProd from './configureStore.prod';

const selectedConfigureStore =
  CONFIG.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export const { configureStore } = selectedConfigureStore;

export const { history } = selectedConfigureStore;
