// @flow
import React, { Component } from "react";
import { Box, Flex, Buttons, Type, Button, Input } from "blockstack-ui/dist";
import iconImage from "../images/icon.png";
import { Link } from 'react-router-dom'

type Props = {};

const Title = ({ ...rest }) => (
  <Type
    display="block"
    fontSize={8}
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
        <Box pb={4} maxWidth="500px">
          <Title>Welcome to the Stacks Wallet</Title>
        </Box>
        <Type maxWidth="300px">
          Choose one of the following options to setup your Stacks wallet.
        </Type>

        <Buttons maxWidth="420px" mx="auto" flexDirection="column" mt={5}>
          <Button is={Link} invert to="/hardware">
            Use a Hardware Wallet
          </Button>
          <Button is={Link} mt={4} invert to="/restore">
            Use a Stacks Address
          </Button>
        </Buttons>
      </Flex>
    );
  }
}
