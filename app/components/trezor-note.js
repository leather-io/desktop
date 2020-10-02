import React from "react";
import { Box } from "blockstack-ui/dist";
import { TextLink } from "@containers/buttons/onboarding-navigation";
import { shell } from "electron";

export const TrezorNote = ({ onDark = true, ...rest }) => (
  <Box fontSize="14px" {...rest}>
    Having issues with your Trezor?{" "}
    <TextLink
      onClick={() =>
        shell.openExternal(
          "https://docs.blockstack.org/stacks-wallet/usage#trezor-wallet-support"
        )
      }
      fontSize="14px"
      px={1}
      pt={0}
      onDark={onDark}
    >
      See our docs.
    </TextLink>
  </Box>
);
