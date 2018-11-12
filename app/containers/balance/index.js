import React from "react";
import { Flex, Type, Button, Buttons } from "blockstack-ui/dist";
import QrCode from "mdi-react/QrcodeIcon";
import SendIcon from "mdi-react/SendIcon";
import { OpenModal } from "@components/modal";
import { ReceiveModal } from "@containers/modals/receive";
import { Modal } from "@components/modal";
import { Send } from "@containers/modals/send";
import { Value } from "@components/stacks";

const funct = ({ visible, hide }) => (
  <ReceiveModal hide={hide} visible={visible} />
);

const ReceiveButton = ({ ...rest }) => (
  <OpenModal component={funct}>
    {({ bind }) => (
      <Button icon={QrCode} width={150} height={"auto"} py={2} mx={2} {...bind}>
        Receive
      </Button>
    )}
  </OpenModal>
);
const SendButton = ({ ...rest }) => (
  <OpenModal
    component={({ visible, hide }) => (
      <Modal title="Send Stacks" hide={hide}>
        <Send />
        <Buttons>
          <Button>Continue</Button>
        </Buttons>
      </Modal>
    )}
  >
    {({ bind }) => (
      <Button
        icon={SendIcon}
        width={150}
        height={"auto"}
        py={2}
        mx={2}
        {...bind}
      >
        Send
      </Button>
    )}
  </OpenModal>
);

const BalanceSection = ({ value, ...rest }) => {
  return (
    <Flex pb={4} flexDirection={"column"} alignItems={"center"}>
      <Type fontWeight="bold" color="hsl(205, 30%, 70%)">
        Wallet Balance
      </Type>
      <Flex py={6} alignItems={"center"}>
        <Value amount={value} />
        <Type pl={2} fontSize={3} color="hsl(205, 30%, 70%)" fontWeight="bold">
          STX
        </Type>
      </Flex>
    </Flex>
  );
};

const Balance = ({ value = 0, ...rest }) => (
  <Flex
    flexShrink={0}
    width={1}
    flexDirection={"column"}
    alignItems={"center"}
    pt={8}
    pb={7}
  >
    <BalanceSection value={value} />
    <Buttons>
      <SendButton />
      <ReceiveButton />
    </Buttons>
  </Flex>
);

export { Balance };
