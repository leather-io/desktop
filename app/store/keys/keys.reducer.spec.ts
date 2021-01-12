import { createKeysReducer, KeysState } from './keys.reducer';
import { persistMnemonicSafe, persistMnemonic } from './keys.actions';

jest.mock('electron-store');

describe('keysReducer', () => {
  let reducer: ReturnType<typeof createKeysReducer>;

  beforeEach(() => (reducer = createKeysReducer()));

  describe('persistMnemonicSafe', () => {
    test('the mnemonic is stored', () => {
      const state = { mnemonic: null } as KeysState;
      const action = persistMnemonicSafe('test mnemonic');
      const result = reducer(state, action);
      expect(result).toEqual({ mnemonic: 'test mnemonic' });
    });

    test('mnemonic is not changed when already exists', () => {
      const state = { mnemonic: 'already set mnemonic' } as KeysState;
      const action = persistMnemonicSafe('test mnemonic');
      const result = reducer(state, action);
      expect(result).toEqual({ mnemonic: 'already set mnemonic' });
    });
  });

  describe('persistMnemonic', () => {
    test('it saves mnemonic, regardless', () => {
      const state = { mnemonic: 'twenty four words blah' } as KeysState;
      const action = persistMnemonic('test mnemonic');
      const result = reducer(state, action);
      expect(result).toEqual({ mnemonic: 'test mnemonic' });
    });
  });
});
