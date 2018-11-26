import React from "react";
import { Button, Type, Flex, Card } from "blockstack-ui";
import { HardwareSteps } from "@containers/hardware-steps";
import { ledgerSteps } from "@screens/onboarding/hardware-wallet/ledger";
import { trezorSteps } from "@screens/onboarding/hardware-wallet/trezor";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { decodeRawTx } from "@utils/stacks";
import { ERRORS } from "@common/lib/transactions";

const HardwareView = ({
  wrapper: Wrapper,
  nextView,
  prevView,
  children,
  type,
  hide,
  doSignTransaction,
  state,
  sender,
  setState,
  ...rest
}) => {
  const handleSubmit = async () => {
    setState({
      processing: true
    });
    try {
      const tx = await doSignTransaction(
        sender,
        state.values.recipient,
        state.values.amount,
        type,
        state.values.memo || ""
      );

      if (tx && tx.error) {
        console.log("error");
        console.log(tx);
        if (
          tx.error.message &&
          tx.error.message.includes("Not enough UTXOs to fund. Left to fund: ")
        ) {
          const difference = Number(
            tx.error.message.replace(
              "Not enough UTXOs to fund. Left to fund: ",
              ""
            )
          );
          console.log(difference);
          setState({
            errors: {
              ...ERRORS.INSUFFICIENT_BTC_BALANCE,
              difference
            }
          });
        }
        return;
      }
      console.log("Right before", tx);
      const decoded = decodeRawTx(tx.rawTx);

      setState(
        {
          tx: {
            ...tx,
            decoded
          }
        },
        () => nextView()
      );
    } catch (e) {
      console.log("caught error, processing done");
      console.log(e);
      setState({
        processing: false
      });
    }
  };
  return children ? (
    <Wrapper hide={hide}>
      <Flex flexDirection="column" alignItems="center" pt={4}>
        <Type pb={6} fontSize={4}>
          Connect your {type === WALLET_TYPES.TREZOR ? "Trezor" : "Ledger"}
        </Type>
        <HardwareSteps
          steps={type === WALLET_TYPES.TREZOR ? trezorSteps : ledgerSteps}
        >
          {({ step, next, hasNext, lastView, prev }) => (
            <Flex pt={4}>
              {children({
                next: {
                  label: state.processing
                    ? "Loading..."
                    : hasNext
                    ? "Next"
                    : "Continue",
                  action: () => (hasNext ? next() : handleSubmit()),
                  props: {
                    style: {
                      pointerEvents: state.processing ? "none" : "unset"
                    }
                  }
                },
                secondary: [
                  {
                    label: "Back",
                    action: prevView
                  }
                ].concat(
                  hasNext
                    ? [
                        {
                          label: "Skip",
                          action: lastView
                        }
                      ]
                    : []
                )
              })}
            </Flex>
          )}
        </HardwareSteps>
      </Flex>
    </Wrapper>
  ) : null;
};
export { HardwareView };
