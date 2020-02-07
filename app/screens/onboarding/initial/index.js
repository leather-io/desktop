import React, { Component } from "react";
import { Box, Flex, Buttons, Type, Input } from "blockstack-ui/dist";
import { Button } from "@components/button/index";
import { Link } from "react-router-dom";
import { ROUTES } from "@common/constants";

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

// const InitialScreen = ({ ...props }) => (
class InitialScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    clicks: 0
  };

  handleClicks = (history) => {
    if (this.state.clicks >= 9) {
      this.secretWatchOnlyScreen(history)
      this.setState({
        clicks: 0
      })
    } else {
      const clicks = this.state.clicks
      this.setState({
        clicks: clicks+1
      })
    }
  }

  secretWatchOnlyScreen = (history) => {
    history.push(ROUTES.RESTORE_WATCH)
  }
  
  render = () => {
    return (
      <Flex
        flexGrow={1}
        flexDirection="column"
        bg="blue.dark"
        color="white"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        {...this.props}
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
          Choose one of the following options to set up a Stacks wallet.
        </Type>
        <Buttons maxWidth="420px" mx="auto" flexDirection="column" pt={5}>
          <Button outline is={Link} invert to={ROUTES.NEW_OPTIONS}>
            Create new wallet
          </Button>
          <Button outline is={Link} mt={4} invert to={ROUTES.RESTORE_OPTIONS}>
            Restore existing wallet
          </Button>
        </Buttons>
        <Type
            pt={5}
            pb={1}
            Type
            lineHeight={1.5}
            fontSize={1}
            textAlign="right"
            color="white"
            maxWidth="600px"
          >
          <a href="https://docs.blockstack.org/org/wallet-use.html" target='_blank'>Wallet help</a>
          </Type>
        <Type 
          position="absolute" 
          bottom="15px" 
          right="15px" 
          fontSize="12px" 
          onClick={() => this.handleClicks(this.props.history)}
          >
          v3.0.2
        </Type>
      </Flex>
    )
  }
}

export default InitialScreen;
