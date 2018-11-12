import React from "react";
import { Flex, Type, Button, Buttons } from "blockstack-ui/dist";
import QrCode from "mdi-react/QrcodeIcon";
import { Field } from "@components/field";
import { Modal } from "@components/modal";

const ReceiveModal = ({ hide, visible, ...rest }) => (
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
      <QrCode size={300} />
    </Flex>
    <Flex p={4} width={1}>
      <Field width={1}
        label="Stacks Address"
        value="SM3KJBA4RZ7Z20KD2HBXNSXVPCR1D3CRAV6Q05MKT"
        disabled
        copy
      />
    </Flex>
  </Modal>
);

export { ReceiveModal };
