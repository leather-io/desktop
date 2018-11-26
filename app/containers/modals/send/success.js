import React from "react";
import { Button, Type, Flex, Card } from "blockstack-ui";
import { StaticField, Label } from "@components/field";
import { satoshisToBtc } from "@utils/utils";
const Success = ({
  wrapper: Wrapper,
  nextView,
  children,
  hide,
  state,
  ...rest
}) => {
  if (!state.tx) return <>Oops!</>;

  const { fee, rawTx, decoded } = state.tx;
  return (
    <Wrapper p={0} pb={4} hide={hide}>
      <Flex
        borderBottom={1}
        borderColor="blue.mid"
        bg="blue.light"
        p={4}
        width={1}
      >
        <Card p={0} width={1}>
          <Flex flexGrow={1}>
            <Flex
              alignItems={"center"}
              p={4}
              borderRight={1}
              borderColor="blue.mid"
              width="50%"
            >
              <Type fontSize={3}>Transaction Sent!</Type>
            </Flex>
            <Flex p={4} flexDirection="column">
              <Label>Amount Sent</Label>
              <Type fontSize={4}>{decoded.tokenAmountReadable} STX</Type>
              <Label pt={3}>Fee</Label>
              <Type>{satoshisToBtc(fee)} BTC</Type>
            </Flex>
          </Flex>
        </Card>
      </Flex>
      <Flex flexDirection="column" p={4} pb={0}>
        <StaticField label="Recipient" value={decoded.recipient} />
        {state.txHash ? (
          <StaticField
            label="Tx Hash"
            value={state.txHash}
            link={`https://explorer.blockstack.org/tx/${state.txHash}`}
          />
        ) : null}
        {decoded.memo !== "" ? (
          <StaticField label="Memo" value={decoded.memo} />
        ) : null}
      </Flex>
      {children
        ? children({
            next: {
              action: () => hide()
            }
          })
        : null}
    </Wrapper>
  );
};
export { Success };
