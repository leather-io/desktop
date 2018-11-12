import React from "react";
import { Flex, Type } from "blockstack-ui/dist";
import QrCode from "mdi-react/QrcodeIcon";
import SendIcon from "mdi-react/SendIcon";
import { Hover } from "react-powerplug";

const TypeIcon = ({ type }) => {
  const Icon = type === "sent" ? SendIcon : QrCode;
  return (
    <Flex
      mr={3}
      border={1}
      borderColor="blue.mid"
      size={48}
      borderRadius={48}
      alignItems="center"
      justifyContent="center"
      bg="white"
    >
      <Icon size={20} style={{ display: "block" }} />
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
        bg={hovered ? "blue.light" : undefined}
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

const Details = ({ ...rest }) => (
  <Flex flexDirection={"column"} flexGrow={1}>
    <Type pb={1} fontWeight={500}>
      Sent Stacks
    </Type>
    <Type fontSize={1} color="hsl(205, 30%, 70%)">
      To SPNN289GPP5HQA5ZF2FKQKJM3K2MP...
    </Type>
  </Flex>
);

const Amount = ({ ...rest }) => (
  <Flex>
    <Type>
      -6,845 <Type color="hsl(205, 30%, 70%)">STX</Type>
    </Type>
  </Flex>
);

const TxItem = ({ last, ...rest }) => (
  <Item last={last}>
    <Date />
    <TypeIcon type="sent" />
    <Details />
    <Amount />
  </Item>
);

export { TxItem };
