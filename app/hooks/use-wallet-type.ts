import { selectWalletType } from '@store/keys';
import { whenWallet as whenWalletFactory } from '@utils/when-wallet';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

type WhenWalletCallback = ReturnType<typeof whenWalletFactory>;

export function useWalletType() {
  const walletType = useSelector(selectWalletType);
  const whenWallet = useCallback<WhenWalletCallback>(
    args => whenWalletFactory(walletType)(args),
    [walletType]
  );
  return { walletType, whenWallet };
}
