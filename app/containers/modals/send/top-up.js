import React from "react";
import { Button, Type, Flex, Card } from "blockstack-ui";
import { ConnectedQrCode } from "@containers/qrcode";
import { BtcField } from "@containers/fields/btc-address";
import { satoshisToBtc } from "@utils/utils";
import { StaticField } from "@components/field";

const LineItem = ({ label, value }) => (
  <Flex width={"100%"} justifyContent="space-between">
    <Type fontSize={2} lineHeight={1.5}>
      {label}
    </Type>
    <Type fontSize={2} lineHeight={1.5}>
      {value}
    </Type>
  </Flex>
);

const BTCTopUpView = ({
  wrapper: Wrapper,
  nextView,
  children,
  hide,
  state,
  ...rest
}) => {
  const { errors } = state;
  const { btcBalance, difference, estimate } = errors;

  const items = [
    {
      label: "Estimated Fee:",
      value: `${satoshisToBtc(estimate)} BTC`
    },
    {
      label: "Current Balance:",
      value: `${satoshisToBtc(btcBalance)} BTC`
    },
    {
      label: "Difference:",
      value: `${satoshisToBtc(difference)} BTC`
    }
  ];
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
              alignItems="flex-start"
              p={4}
              borderRight={1}
              borderColor="blue.mid"
              width="65%"
              flexDirection="column"
              justifyContent="center"
            >
              <Type fontWeight={600} pb={2} fontSize={3} lineHeight={1.5}>
                You don't have enough BTC to fund this transaction.
              </Type>
              <Type fontSize={2} lineHeight={1.5}>
                BTC is used to pay fees for Stacks transactions. Please send at
                least {satoshisToBtc(difference)} BTC to continue.
              </Type>
              <Flex
                width={1}
                pt={3}
                flexDirection="column"
                justifyContent="center"
              >
                {items.map((item, i) => (
                  <LineItem {...item} key={i} />
                ))}
              </Flex>
            </Flex>
            <Flex
              alignItems="center"
              p={4}
              justifyContent="center"
              flexDirection="column"
            >
              <ConnectedQrCode size={200} type="btc" />
            </Flex>
          </Flex>
        </Card>
      </Flex>
      <Flex flexDirection="column" p={4} pb={0}>
        <StaticField
          label="BTC amount needed"
          value={`${satoshisToBtc(difference)}`}
        />
        <BtcField />
      </Flex>

      {children
        ? children({
            next: {
              action: () => console.log("refresh"),
              label: "Try Again"
            }
          })
        : null}
    </Wrapper>
  );
};

export { BTCTopUpView };
