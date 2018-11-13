import React from "react";
import { Flex, Type } from "blockstack-ui/dist";
import QrCode from "mdi-react/QrcodeIcon";
import SendIcon from "mdi-react/SendIcon";
import { Hover } from "react-powerplug";
import { TxDetailsModal } from "@containers/modals/tx";
import { OpenModal } from "@components/modal";

export const TypeIcon = ({ type, size = 48, ...rest }) => {
  const Icon = type === "SENT" ? SendIcon : QrCode;
  return (
    <Flex
      border={1}
      borderColor="blue.mid"
      size={size}
      borderRadius={size}
      alignItems="center"
      justifyContent="center"
      bg="white"
      flexShrink={0}
      {...rest}
    >
      <Icon size={size / 2.5} style={{ display: "block" }} />
    </Flex>
  );
};
const Item = ({ last, ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Flex
        borderBottom={!last ? "1px solid" : undefined}
        borderColor={!last ? "blue.mid" : undefined}
        alignItems="center"
        flexShrink={0}
        bg={hovered ? "hsl(202, 40%, 97.5%)" : "white"}
        cursor={hovered ? "pointer" : undefined}
        px={4}
        py={4}
        {...rest}
        {...bind}
      />
    )}
  </Hover>
);
const Date = ({ ...rest }) => (
  <Flex pr={4} flexDirection={"column"} alignItems={"center"}>
    <Type fontSize={1} fontWeight="bold">
      SEP
    </Type>
    <Type color="hsl(205, 30%, 70%)" fontSize={3}>
      25
    </Type>
  </Flex>
);

const Details = ({ operation, recipient, pending, ...rest }) => (
  <Flex flexDirection={"column"} flexGrow={1} maxWidth="100%" overflow="hidden">
    <Type pb={1} display={"inline-flex"} alignItems="center" fontWeight={500}>
      {operation === "SENT" ? "Sent" : "Received"} Stacks{" "}
      {pending ? (
        <Type
          ml={2}
          bg="blue.mid"
          lineHeight="1rem"
          borderRadius={6}
          py={"1px"}
          px={"5px"}
          fontSize={"9px"}
          letterSpacing="1px"
        >
          PENDING
        </Type>
      ) : null}
    </Type>
    <Type
      overflow="hidden"
      maxWidth="100%"
      style={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
      }}
      fontSize={1}
      color="hsl(205, 30%, 70%)"
    >
      {operation === "SENT" ? "To" : "From"} {recipient}
    </Type>
  </Flex>
);

const Amount = ({ value, ...rest }) => (
  <Flex
    style={{
      whiteSpace: "nowrap"
    }}
    textAlign="right"
    {...rest}
  >
    <Type>
      {parseInt(value) / 1000000} <Type color="hsl(205, 30%, 70%)">STX</Type>
    </Type>
  </Flex>
);

const TxItem = ({ last, item, ...rest }) => {
  const { operation, recipient, tokensSent, pending } = item;
  return (
    <OpenModal
      component={({ hide, visible }) => (
        <TxDetailsModal hide={hide} tx={item} />
      )}
    >
      {({ bind }) => (
        <Item {...bind} last={last}>
          <Date />
          <TypeIcon mr={3} type={operation} />
          <Details
            pending={pending}
            operation={operation}
            recipient={recipient}
          />
          <Amount ml={3} value={tokensSent} />
        </Item>
      )}
    </OpenModal>
  );
};

export { TxItem };
