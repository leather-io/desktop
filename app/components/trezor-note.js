import React from "react";
import { Box } from "blockstack-ui/dist";
import { TextLink } from "@containers/buttons/onboarding-navigation";
import { shell } from "electron";

export const TrezorNote = props => {
  return (
    <Box fontSize="14px" {...props}>
      Having issues with your Trezor?{" "}
      <TextLink
        onClick={() =>
          shell.openExternal(
            "https://docs.blockstack.org/stacks-wallet/usage#trezor-wallet-support"
          )
        }
        fontSize="14px"
        px={1}
        onDark
        pt={0}
      >
        See our docs.
      </TextLink>
    </Box>
  );
};
