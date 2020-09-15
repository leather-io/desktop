import React from "react";
import { Flex, Type, Input, Button } from "blockstack-ui/dist";
import { Modal } from "@components/modal";
import { satoshisToBtc } from "@utils/utils";
import {
  doSignBTCTransaction,
  doBroadcastTransaction,
  doClearError
} from "@stores/actions/wallet";

// eslint-disable-next-line import/prefer-default-export
class WithdrawBTCModal extends React.Component {
  state = {
    processing: false,
    values: {
      recipient: "",
    },
    errors: {}
  };

  async handleSubmit(){
    const recipient = this.state.values.recipient
    // todo: show seed input
    // call doSignBTCTransaction()
  }

  render(){
    return (
      <Modal
        title="Withdraw BTC"
        hide={this.props.hide}
        maxWidth={"560px"}
        p={0}
        position={"relative"}
      >
        <Flex
          p={4}
          borderBottom={1}
          borderColor="blue.mid"
          alignItems="center"
          justifyContent="center"
          width={1}
          bg="blue.light"
        >
          <Type fontSize={4} lineHeight={1.5}>
            Enter a Bitcoin address to withdraw {satoshisToBtc(this.props.balance)} BTC from
            the Stacks Wallet.
          </Type>
        </Flex>
        <Flex p={4} width={1}>
          <Input 
            placeholder="Enter a BTC address" 
            width="100%" 
            flexGrow={1} 
            onChange={e => {
              this.setState({values: { recipient: e.target.value}})
            }}
          />
        </Flex>
        <Flex justifyContent="center" pb={4} px={4} width={1}>
          <Button onClick={() => this.handleSubmit()}>Withdraw BTC</Button>
        </Flex>
      </Modal>)
  }
};

export { WithdrawBTCModal }