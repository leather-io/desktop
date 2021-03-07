import { WalletType } from '../models/wallet-type';

export function isLedgerWallet(walletType: WalletType) {
  return walletType === 'ledger';
}

export function isSoftwareWallet(walletType: WalletType) {
  return walletType === 'software';
}

export function whenWallet(walletType: WalletType) {
  return <T>(walletTypeMap: { ledger: T; software: T }): T => {
    if (isLedgerWallet(walletType)) return walletTypeMap.ledger;
    if (isSoftwareWallet(walletType)) return walletTypeMap.software;
    throw new Error('Wallet is neither of type `ledger` nor `software`');
  };
}
