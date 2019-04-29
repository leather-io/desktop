import React, { Component } from "react";
import { Box, Flex, Buttons, Type } from "blockstack-ui/dist";
import { Button } from "@components/button/index";
import { Seed } from "@components/seed/index";
import { Page } from "@components/page";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { ROUTES } from "@common/constants";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { 
  selectWalletLoading, 
  selectWalletSeed, 
  selectWalletStacksAddress 
} from "@stores/selectors/wallet";
import { doAddSoftwareWalletAddress, doClearSeed, doRefreshData } from "@stores/actions/wallet";
import { mnemonicToStxAddress, emptySeedArray } from '@utils/utils'

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

class ConfirmSeedScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    seed: null,
    confirmSeedArray: null,
    error: null,
    loading: false
  };

  componentWillMount = () => {
    this.resetConfirmSeedArray()
  }

  resetConfirmSeedArray = () => {
    this.setState({
      confirmSeedArray: emptySeedArray(12),
    })
  }

  validateSeed = () => {
    const confirmSeed = this.state.confirmSeedArray.join(' ')
    if (confirmSeed === this.props.seed) {
      return true
    } else {
      return false
    }
  }

  handleConfirmSuccess = () => {
    if (this.validateSeed()) {
      const address = mnemonicToStxAddress(this.props.seed)
      this.props.doAddSoftwareWalletAddress(address);
      this.props.doClearSeed();
      this.props.doRefreshData(false);
      this.resetConfirmSeedArray();
      this.setState({
        error: null
      });
      setTimeout(() => {
        this.props.history.push(ROUTES.DASHBOARD);
      }, 10);
    } else {
      this.setState({
        error: "The seed phrase you entered does not match."
      });
    }
  }

  handleKeyPress = (event, index) => {
    if(event.key === ' ') {
      event.preventDefault()
    }
  }

  handleInputChange = (event, index) => {
    const newConfirmSeedArray = this.state.confirmSeedArray
    newConfirmSeedArray[index] = event.target.value
    this.setState({
      confirmSeed: newConfirmSeedArray
    })
  }

  render () {
    const { 
      doAddSoftwareWalletAddress, 
      doClearSeed,
      doRefreshData, 
      loading, 
      stxAddress, 
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
            <Title>Confirm Your Seed Phrase</Title>
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
            Provide all 12 words of your seed phrase by number to confirm you've written them down in order properly.
          </Type>
          <Seed 
            seedPhrase={seed} 
            isInput={true} 
            handleKeyPress={this.handleKeyPress}
            handleChange={this.handleInputChange}
            values={this.state.confirmSeedArray}
          />
          { this.state.error && 
            <Type lineHeight={1.5} fontSize={2} pt={1} color="hsl(10, 85%, 50%)">
              {this.state.error}
            </Type>
          }
          <Buttons maxWidth="420px" mx="auto" flexDirection="column" pt={5}>
            <Button outline invert onClick={this.handleConfirmSuccess}>Done</Button>
            <OnboardingNavigation
                  onDark
                  back={ROUTES.NEW_SEED}
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
    seed: selectWalletSeed(state),
    stxAddress: selectWalletStacksAddress(state)
  }),
  {
    doAddSoftwareWalletAddress,
    doRefreshData,
    doClearSeed
  }
)(withRouter(ConfirmSeedScreen));