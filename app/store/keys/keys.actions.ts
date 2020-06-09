import { push } from 'connected-react-router';
import { createAction, Dispatch } from '@reduxjs/toolkit';
import { generateMnemonicRootKeychain } from '@blockstack/keychain';
import routes from '../../constants/routes.json';
import { MNEMONIC_ENTROPY } from '../../constants';

export const persistMnemonicSafe = createAction<string>('keys/save-mnemonic-safe');

export const persistMnemonic = createAction<string>('keys/save-mnemonic');

export const removeMnemonic = createAction<string>('keys/remove-mnemonic');

export const onboardingMnemonicGenerationStep = ({
  stepDelayMs,
}: {
  stepDelayMs: number;
}) => async (dispatch: Dispatch) => {
  const key = await generateMnemonicRootKeychain(MNEMONIC_ENTROPY);
  dispatch(persistMnemonicSafe(key.plaintextMnemonic));
  setTimeout(() => dispatch(push(routes.SECRET_KEY)), stepDelayMs);
};
