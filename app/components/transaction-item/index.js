import React from "react";
import { Flex, Type, Tooltip } from "blockstack-ui/dist";
import LockOpenIcon from "mdi-react/LockOpenIcon";
import NewBoxIcon from "mdi-react/NewBoxIcon";
import QrCode from "mdi-react/QrcodeIcon";
import SendIcon from "mdi-react/SendIcon";
import { Hover } from "react-powerplug";
import { TxDetailsModal } from "@containers/modals/tx";
import { OpenModal } from "@components/modal";
import dayjs from "dayjs";
export const TypeIcon = ({ type, size = 48, ...rest }) => {
  const Icon =
    type === "SENT"
      ? SendIcon
      : type === "RECEIVED"
        ? QrCode
        : type === "UNLOCK"
          ? LockOpenIcon
          : NewBoxIcon;
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
        flexGrow={1}
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
const Date = ({ date, ...rest }) =>
  date ? (
    <Flex
      title={dayjs(date).format("DD MMMM YYYY")}
      pr={4}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <Type fontSize={1} fontWeight="bold">
        {dayjs(date)
          .format("MMM")
          .toUpperCase()}
      </Type>
      <Type color="hsl(205, 30%, 70%)" fontSize={3}>
        {dayjs(date).format("DD")}
      </Type>
    </Flex>
  ) : null;

const Details = ({ operation, recipient, pending, ...rest }) => (
  <Flex flexDirection={"column"} flexGrow={1} maxWidth="100%" overflow="hidden">
    <Type pb={1} display={"inline-flex"} alignItems="center" fontWeight={500}>
      {operation === "SENT"
        ? "Sent Stacks"
        : operation === "RECEIVED"
          ? "Received Stacks"
          : operation === "UNLOCK"
            ? "Stacks Unlocked"
            : "Genesis Block"}
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
      {operation === "SENT"
        ? `To ${recipient}`
        : operation === "RECEIVED"
          ? `From ${recipient}`
          : null}
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
      {value} <Type color="hsl(205, 30%, 70%)">STX</Type>
    </Type>
  </Flex>
);

const TxItem = ({ last, item, ...rest }) => {
  const { operation, recipient, blockTime, pending, valueStacks } = item;
  return (
    <OpenModal
      component={({ hide, visible }) => (
        <TxDetailsModal hide={hide} tx={item} />
      )}
    >
      {({ bind }) => (
        <Item {...bind} last={last}>
          <Date date={blockTime} />
          <TypeIcon mr={3} type={operation} />
          <Details
            pending={pending}
            operation={operation}
            recipient={recipient}
          />
          <Amount ml={3} value={valueStacks} />
        </Item>
      )}
    </OpenModal>
  );
};

export { TxItem };
