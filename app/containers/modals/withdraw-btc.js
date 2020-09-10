import React from "react";
import { Flex, Type, Input, Button } from "blockstack-ui/dist";
import { Modal } from "@components/modal";
import { satoshisToBtc } from "@utils/utils";

// eslint-disable-next-line import/prefer-default-export
export const WithdrawBTCModal = ({ hide, balance }) => (
  <Modal
    title="Withdraw BTC"
    hide={hide}
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
        Enter a Bitcoin address to withdraw {satoshisToBtc(balance)} BTC from
        the Stacks Wallet.
      </Type>
    </Flex>
    <Flex p={4} width={1}>
      <Input placeholder="Enter a BTC address" width="100%" flexGrow={1} />
    </Flex>
    <Flex justifyContent="center" pb={4} px={4} width={1}>
      <Button>Withdraw BTC</Button>
    </Flex>
  </Modal>
);
