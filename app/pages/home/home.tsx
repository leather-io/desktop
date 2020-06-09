import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Box } from '@blockstack/ui';
import { ChainID } from '@blockstack/stacks-transactions';
import { deriveRootKeychainFromMnemonic, deriveStxAddressChain } from '@blockstack/keychain';

import { selectMnemonic } from '../../store/keys';
import { BIP32Interface } from '@blockstack/keychain/node_modules/bip32';

//
// Placeholder component
export const Home: React.FC = () => {
  const mnemonic = useSelector(selectMnemonic);
  const [keychain, setKeychain] = useState<{ rootNode: BIP32Interface } | null>(null);
  useEffect(() => {
    const deriveMasterKeychain = async () => {
      if (!mnemonic) return;
      const resp = await deriveRootKeychainFromMnemonic(mnemonic, '');
      setKeychain(resp);
    };
    void deriveMasterKeychain();
  }, [mnemonic]);

  const { privateKey } = keychain?.rootNode
    ? deriveStxAddressChain(ChainID.Testnet)(keychain.rootNode)
    : { privateKey: '' };

  if (!mnemonic) return <>'How you get to homepage without a mnemonic?'</>;

  console.log(keychain);

  return (
    <Flex pt="120px" flexDirection="column" mx="loose">
      <Box>Mnemonic: {mnemonic}</Box>
      <Box mt="loose">MnemonicEncryptedHex: {(keychain as any)?.encryptedMnemonicHex}</Box>
      <Box mt="loose">Private key: {privateKey}</Box>
    </Flex>
  );
};
