// @flow
import React, { Component } from "react";
import { Box, Flex, Buttons, Type, Input } from "blockstack-ui/dist";
import { Button } from "./button/index";
import { Link } from "react-router-dom";

type Props = {};

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

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <Flex
        flexGrow={1}
        flexDirection="column"
        bg="blue.dark"
        color="white"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Box pb={6} maxWidth="400px">
          <Title>Welcome to the Stacks Wallet</Title>
        </Box>
        <Type pb={3} color="hsl(242, 56%, 75%)" maxWidth="300px">
          Choose one of the following options to setup your Stacks wallet.
        </Type>

        <Buttons
          maxWidth="420px"
          mx="auto"
          flexDirection="column"
          pt={6}
        >
          <Button
            outline
            is={Link}
            invert
            to="/hardware"
          >
            Use a Hardware Wallet
          </Button>
          <Button outline is={Link} mt={4} invert to="/restore">
            Use a Stacks Address
          </Button>
        </Buttons>
      </Flex>
    );
  }
}
