import React from "react";
import { Box, Flex, Buttons, Type, Input } from "blockstack-ui/dist";
import { Button } from "@components/button/index";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes";

const Title = ({ ...rest }) => (
  <Type
    display="block"
    fontSize={7}
    fontWeight="300"
    fontFamily="brand"
    lineHeight={1.3}
    {...rest}
  />
);

const InitialScreen = ({ ...props }) => (
  <Flex
    flexGrow={1}
    flexDirection="column"
    bg="blue.dark"
    color="white"
    justifyContent="center"
    alignItems="center"
    textAlign="center"
    {...props}
  >
    <Box maxWidth="400px">
      <Title>Welcome to the Stacks Wallet</Title>
    </Box>
    <Type
      pb={2}
      Type
      lineHeight={1.5}
      fontSize={2}
      pt={4}
      color="hsl(242, 56%, 75%)"
      maxWidth="300px"
    >
      Choose one of the following options to setup your Stacks wallet.
    </Type>
    <Buttons maxWidth="420px" mx="auto" flexDirection="column" pt={5}>
      <Button outline is={Link} invert to={ROUTES.RESTORE_HARDWARE}>
        Use a Hardware Wallet
      </Button>
      <Button outline is={Link} mt={4} invert to={ROUTES.RESTORE_WATCH}>
        Use a Stacks Address
      </Button>
    </Buttons>
  </Flex>
);

export default InitialScreen;
