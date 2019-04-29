import React, { Component } from "react";
import { Box, Flex, Buttons, Type } from "blockstack-ui/dist";
import { Button } from "@components/button/index";
import { Seed } from "@components/seed/index";
import { Page } from "@components/page";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { Link } from "react-router-dom";
import { ROUTES } from "@common/constants";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { selectWalletLoading, selectWalletSeed } from "@stores/selectors/wallet";
import { doGenerateNewSeed, doRefreshData } from "@stores/actions/wallet";

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

class NewSeedScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    seed: null,
    loading: false
  };

  componentDidMount = () => {
    this.props.doGenerateNewSeed()
  }

  render () {
    const { 
      doGenerateNewSeed, 
      doRefreshData, 
      loading,
      seed, 
      ...rest 
    } = this.props

    return (
      <Page
        alignItems="center"
        justifyContent="center"
        {...rest}
      >
        <Flex
          flexGrow={1}
          flexDirection="column"
          bg="blue.dark"
          color="white"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          {...rest}
        >
          <Box maxWidth="600px">
            <Title>Secure Your Seed Phrase</Title>
          </Box>
          <Type
            pt={5}
            pb={2}
            Type
            lineHeight={1.5}
            fontSize={2}
            color="hsl(242, 56%, 75%)"
            maxWidth="600px"
          >
            Every wallet is derived from a uniquely generated, 12-word sequence called a "seed phrase". 
            You must provide this seed phrase every time you want to perform a transaction.
            <br/><br/>
            Write down the seed phrase below. Secure the written seed phrase in a safe deposit box or similar.
            If you lose your seed phrase, you lose all your tokens. <br/>
            <a href="https://docs.blockstack.org/org/wallet-intro.html" target='_blank'>Read more</a>
          </Type>
          <Seed seedPhrase={seed} isInput={false}/>
          <Buttons maxWidth="420px" mx="auto" flexDirection="column" pt={5}>
            <Button outline is={Link} invert to={ROUTES.CONFIRM_SEED}>
              I've written these down in order
            </Button>
            <OnboardingNavigation
                  onDark
                  back={ROUTES.NEW_OPTIONS}
                />
          </Buttons>
        </Flex>
      </Page>
    );
  }
}

export default connect(
  state => ({
    loading: selectWalletLoading(state),
    seed: selectWalletSeed(state)
  }),
  {
    doGenerateNewSeed,
    doRefreshData
  }
)(withRouter(NewSeedScreen));