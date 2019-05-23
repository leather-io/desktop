import React from "react";
import { Flex, Type, Button, Buttons } from "blockstack-ui/dist";
import { Field } from "@components/field";
import { Modal } from "@components/modal";
import { QrCode } from "@containers/qrcode";
import { connect } from "react-redux";
import { selectWalletStacksAddress } from "@stores/selectors/wallet";

const ReceiveModal = connect(state => ({
  address: selectWalletStacksAddress(state)
}))(({ address, hide, ...rest }) => (
  <Modal title="Receive Stacks (STX)" hide={hide} maxWidth={"560px"} p={0}>
    <Flex
      p={4}
      borderBottom={1}
      borderColor="blue.mid"
      alignItems="center"
      justifyContent="center"
      width={1}
      bg="blue.light"
    >
      <QrCode value={address} />
    </Flex>
    <Flex p={4} width={1}>
      <Field width={1} label="Stacks address" value={address} disabled copy />
    </Flex>
  </Modal>
));

export { ReceiveModal };
