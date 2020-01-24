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
  selectWalletBalance,
  selectPendingBalance
} from "@stores/selectors/wallet";
import { selectAppUpdateRequired } from "@stores/selectors/app";
import { microToStacks } from "stacks-utils";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { Notice } from "@components/notice";
import { formatMicroStxValue } from "@utils/utils";
import { shell } from "electron";

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
  <OpenModal component={({ visible, hide }) => <Send hide={hide} />}>
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
  pendingBalance: selectPendingBalance(state),
  balance: selectWalletBalance(state)
}))(({ value, balance, data, pendingBalance, ...rest }) => {
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
                  Available balance
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
              <Type>Available balance</Type>
            )}
          </Type>
          <Flex py={6} alignItems={"center"}>
            <Value
              amount={formatMicroStxValue(
                microToStacks(
                  state.view === "balance"
                    ? balance
                    : data && data.vesting_total
                )
              )}
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
          {(pendingBalance != null) ? (
            <Type fontWeight="500">
              <Type color="hsl(205, 30%, 70%)">Pending Balance:</Type>{" "}
              {formatMicroStxValue(microToStacks(pendingBalance))}{" "}
              <Type color="hsl(205, 30%, 70%)">STX</Type>{" "}
            </Type>
          ) : null}
        </Flex>
      )}
    </State>
  );
});

const Balance = connect(state => ({
  type: selectWalletType(state),
  updateRequired: selectAppUpdateRequired(state)
}))(({ type, updateRequired, ...rest }) => (
  <Flex
    flexShrink={0}
    width={1}
    flexDirection={"column"}
    alignItems={"center"}
    {...rest}
  >
    <BalanceSection pt={6} pb={5} />
    {type === WALLET_TYPES.WATCH_ONLY ?       
      <Notice>
        This is a watch only wallet, you can view your balance and transaction
        history only.
      </Notice>
      : null }
    {type !== WALLET_TYPES.WATCH_ONLY ? (
      <Buttons pb={5}>
        <SendButton />
        <ReceiveButton />
      </Buttons>
    ) : null}
    {updateRequired ? (
      <Notice>
        Your wallet software needs to be updated in order to send
        transactions. &nbsp;
        <Type 
          cursor="pointer" 
          fontWeight="bold"
          onClick={() => {shell.openExternal("https://wallet.blockstack.org/")}}
        >
        Download Update
        </Type>
      </Notice>
    ) : null}
  </Flex>
));

export { Balance };
