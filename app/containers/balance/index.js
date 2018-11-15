import React from "react";
import { Flex, Type, Button, Buttons } from "blockstack-ui/dist";
import QrCode from "mdi-react/QrcodeIcon";
import SendIcon from "mdi-react/SendIcon";
import { OpenModal } from "@components/modal";
import { ReceiveModal } from "@containers/modals/receive";
import { Modal } from "@components/modal";
import { Send } from "@containers/modals/send";
import { Value } from "@components/stacks";
import { AppContext } from "@containers/Root";
import { State } from "react-powerplug";
import { connect } from "react-redux";
import { selectWalletData, selectWalletType } from "@stores/selectors/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import dayjs from "dayjs";
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
        <Send hide={hide} />
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

const BalanceSection = connect(state => ({
  data: selectWalletData(state)
}))(({ value, data, ...rest }) => {
  if (!data) return null;
  const { balance, formattedUnlockTotal, vesting_total } = data;
  return (
    <State initial={{ view: "balance" }}>
      {({ state, setState }) => (
        <Flex pb={4} flexDirection={"column"} alignItems={"center"} {...rest}>
          <Type fontWeight="bold" color="hsl(205, 30%, 70%)">
            {formattedUnlockTotal ? (
              <>
                <Type
                  onClick={() => setState({ view: "balance" })}
                  color={state.view === "balance" ? "blue.dark" : undefined}
                  cursor="pointer"
                >
                  Wallet Balance
                </Type>{" "}
                /{" "}
                <Type
                  onClick={() => setState({ view: "allocation" })}
                  color={state.view === "allocation" ? "blue.dark" : undefined}
                  cursor="pointer"
                >
                  Allocation
                </Type>
              </>
            ) : (
              <Type>Wallet Balance</Type>
            )}
          </Type>
          <Flex py={6} alignItems={"center"}>
            <Value
              amount={
                parseInt(state.view === "balance" ? balance : vesting_total) /
                1000000
              }
            />
            <Type
              pl={2}
              fontSize={3}
              color="hsl(205, 30%, 70%)"
              fontWeight="bold"
            >
              STX
            </Type>
          </Flex>
        </Flex>
      )}
    </State>
  );
});

const Balance = connect(state => ({
  type: selectWalletType(state)
}))(({ type, ...rest }) => (
  <Flex
    flexShrink={0}
    width={1}
    flexDirection={"column"}
    alignItems={"center"}
    {...rest}
  >
    <BalanceSection pt={6} pb={5} />
    {type !== WALLET_TYPES.WATCH_ONLY ? (
      <Buttons>
        <SendButton />
        <ReceiveButton />
      </Buttons>
    ) : (
      <Flex
        mb={4}
        width={1}
        bg="white"
        borderColor="blue.mid"
        borderRadius={6}
        border={1}
        boxShadow="card"
        overflow="hidden"
      >
        <Flex
          px={4}
          fontSize={1}
          bg="blue.light"
          p={2}
          borderRight={1}
          borderColor="blue.mid"
        >
          Note
        </Flex>
        <Flex px={3} p={2}>
          This is a watch only wallet, you can view your balance and transaction
          history only.
        </Flex>
      </Flex>
    )}
  </Flex>
));

export { Balance };
