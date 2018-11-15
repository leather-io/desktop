import React from "react";
import { Flex, Type, Button, Buttons } from "blockstack-ui/dist";
import { ConnectedQrCode } from "@containers/qrcode";
import { Field } from "@components/field";
import { Modal } from "@components/modal";
import { BtcField } from "@containers/fields/btc-address";

const TxFeesModal = ({ hide }) => (
  <Modal title="Receive Stacks" hide={hide} maxWidth={"560px"} p={0}>
    <Flex
      p={4}
      borderBottom={1}
      borderColor="blue.mid"
      alignItems="center"
      justifyContent="center"
      width={1}
      bg="blue.light"
    >
      <ConnectedQrCode type="btc" />
    </Flex>
    <Flex p={4} width={1}>
      <BtcField />
    </Flex>
  </Modal>
);

export { TxFeesModal };
