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
          textAlign="left"
          {...rest}
        >
          <Box maxWidth="600px">
            <Title>Secure your seed phrase</Title>
          </Box>
          <Type
            pt={4}
            pb={1}
            Type
            lineHeight={1.5}
            fontSize={2}
            color="hsl(242, 56%, 75%)"
            maxWidth="600px"
          >
            A unique 24-word sequence generated for you when you create a wallet. You enter your seed phrase to open your wallet or to send Stacks (STX) tokens. 
          </Type>
          <Type
            pt={2}
            pb={1}
            Type
            lineHeight={1.5}
            fontSize={2}
            textAlign="center"
            color="white"
            maxWidth="600px"
          >
            Don't lose your seed phrase. If you lose your seed phrase, you lose your STX tokens and can <em><strong>never</strong></em> get them back. <a href="https://docs.blockstack.org/org/secureref.html" target='_blank'>Read about wallet security</a>
          </Type>
          <Type
            pt={4}
            pb={1}
            Type
            lineHeight={1.5}
            fontSize={2}
            color="hsl(242, 56%, 75%)"
            maxWidth="600px"
          >
            This is your seed phrase. <strong>(1)</strong> Write down each position and word, for example, <code>1 - frog</code>. <strong>(2)</strong> Store the written seed phrase in a secure location such as a safe deposit box. 
            </Type>
          <Seed seedPhrase={seed} isInput={false} small={true}/>
          <Buttons maxWidth="420px" mx="auto" flexDirection="column" pt={4}>
            <Button outline is={Link} invert to={ROUTES.CONFIRM_SEED}>
              I've written down my seed phrase
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