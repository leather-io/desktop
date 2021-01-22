import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import { Flex, Input, Text, Button } from '@blockstack/ui';

import { ExplainerTooltip } from '@components/tooltip';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { delay } from '@utils/delay';
import { useDecryptWallet } from '@hooks/use-decrypt-wallet';

import { AddressDisplayer } from './address-displayer';

export const RevealStxAddressSoftware: FC = () => {
  const [address, setAddress] = useState<null | string>(null);

  const { decryptWallet } = useDecryptWallet();

  const form = useFormik({
    initialValues: { password: '' },
    async onSubmit(values, form) {
      await delay(200);
      try {
        const { address } = await decryptWallet(values.password);
        setAddress(address);
      } catch (e) {
        form.setErrors({ password: 'Unable to decrypt wallet' });
      }
    },
  });

  return (
    <Flex flexDirection="column" mb="extra-loose" mx="extra-loose">
      {address === null ? (
        <>
          <Text textStyle="body.large.medium" mt="base-loose">
            Unlock your wallet
          </Text>
          <Flex mt="base-tight">
            <ExplainerTooltip textStyle="caption">
              Unlocking your wallet ensures your address has not been modified.
            </ExplainerTooltip>
            <Text textStyle="caption" color="ink.600" ml="extra-tight">
              Enter your password to reveal your STX address
            </Text>
          </Flex>

          <form onSubmit={form.handleSubmit}>
            <Input
              placeholder="Enter your password"
              name="password"
              type="password"
              mt="base-loose"
              maxWidth="380px"
              isDisabled={address !== null}
              {...{ readOnly: address !== null }}
              onChange={form.handleChange}
            />
            {form.errors.password && (
              <ErrorLabel>
                <ErrorText>{form.errors.password}</ErrorText>
              </ErrorLabel>
            )}
            <Button
              type="submit"
              mt="base-loose"
              width="160px"
              isDisabled={form.isSubmitting || address !== null}
              isLoading={form.isSubmitting}
            >
              Reveal STX address
            </Button>
          </form>
        </>
      ) : (
        <AddressDisplayer address={address} />
      )}
    </Flex>
  );
};
