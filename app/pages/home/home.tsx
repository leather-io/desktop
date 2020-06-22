import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Box } from '@blockstack/ui';
import { ChainID } from '@blockstack/stacks-transactions';
import { deriveRootKeychainFromMnemonic, deriveStxAddressChain } from '@blockstack/keychain';

import { selectMnemonic, selectKeysSlice } from '../../store/keys';
import { BIP32Interface } from '../../types';

//
// Placeholder component
export const Home: React.FC = () => {
  const mnemonic = useSelector(selectMnemonic);
  const keys = useSelector(selectKeysSlice);
  const [keychain, setKeychain] = useState<{ rootNode: BIP32Interface } | null>(null);

  useEffect(() => {
    const deriveMasterKeychain = async () => {
      if (!mnemonic) return;
      const resp = await deriveRootKeychainFromMnemonic(mnemonic, '');
      setKeychain(resp);
    };
    void deriveMasterKeychain();
  }, [mnemonic]);

  if (keychain === null) return <div>Homepage, but no keychain can be derived</div>;

  const rootNode = deriveStxAddressChain(ChainID.Testnet)(keychain.rootNode);

  const privateKey = rootNode.privateKey;

  const base58 = rootNode.childKey.toBase58();

  if (!mnemonic) return <>How you get to homepage without a mnemonic?</>;

  // console.log(keychain);

  return (
    <Flex pt="120px" flexDirection="column" mx="loose">
      <Box>Mnemonic: {mnemonic}</Box>
      <Box mt="loose">MnemonicEncryptedHex: {privateKey}</Box>
      <Box mt="loose">Private key: {privateKey}</Box>
      <Box mt="loose">Base58: {base58}</Box>
      <Box mt="loose">Salt: {(keys as any).salt}</Box>
      <Box mt="loose">Password: {(keys as any).password}</Box>
      <Box mt="loose">Stretched Key: {(keys as any).derivedEncryptionKey}</Box>
    </Flex>
  );
};
