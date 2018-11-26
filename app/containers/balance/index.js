import React from "react";
import { Flex, Type, Button, Buttons } from "blockstack-ui/dist";
import QrCode from "mdi-react/QrcodeIcon";
import SendIcon from "mdi-react/SendIcon";
import { OpenModal } from "@components/modal";
import { ReceiveModal } from "@containers/modals/receive";
import { Modal } from "@components/modal";
import { Send } from "@containers/modals/send";
import { Value } from "@components/stacks";
import { State } from "react-powerplug";
import { connect } from "react-redux";
import {
  selectWalletData,
  selectWalletType,
  selectWalletBalance
} from "@stores/selectors/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { Notice } from "@components/notice";

const funct = ({ visible, hide }) => (
  <ReceiveModal hide={hide} visible={visible} />
);

export const ReceiveButton = ({ ...rest }) => (
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
    component={({ visible, hide }) => (<Send hide={hide} />
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
  data: selectWalletData(state),
  balance: selectWalletBalance(state)
}))(({ value, balance, data, ...rest }) => {
  return (
    <State initial={{ view: "balance" }}>
      {({ state, setState }) => (
        <Flex pb={4} flexDirection={"column"} alignItems={"center"} {...rest}>
          <Type fontWeight="bold" color="hsl(205, 30%, 70%)">
            {data && data.formattedUnlockTotal ? (
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
                parseInt(
                  state.view === "balance"
                    ? balance
                    : data && data.vesting_total
                ) / 1000000
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
          {data && state.view === "allocation" ? (
            <Type fontWeight="bold">
              {data.totalUnlockedStacks}{" "}
              <Type color="hsl(205, 30%, 70%)">STX</Type>{" "}
              <Type color="hsl(205, 30%, 70%)">Unlocked</Type>
            </Type>
          ) : null}
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
      <Buttons pb={5}>
        <SendButton />
        <ReceiveButton />
      </Buttons>
    ) : (
      <Notice>
        This is a watch only wallet, you can view your balance and transaction
        history only.
      </Notice>
    )}
  </Flex>
));

export { Balance };
