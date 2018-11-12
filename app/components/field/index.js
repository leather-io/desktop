import React from "react";
import { Flex, Type, Input } from "blockstack-ui/dist";
import { Copy } from "@components/copy";
import { formatStx } from "@utils";

const Label = ({ ...rest }) => (
  <Type pb={2} fontWeight={500} fontSize={1} is="label" {...rest} />
);
/**
 * Field
 * @param {any} label - The label (typically a string)
 * @param {any} overlay - Text to overlay input eg STX
 * @param {string} value - text value
 * @param {boolean} disabled
 * @param {boolean} copy - to enable copy and paste
 */
const Field = ({ label, overlay, disabled, copy, value, ...rest }) => (
  <Flex flexDirection={"column"} pb={5} width={1} flexGrow={1}>
    <Type pb={2} fontWeight={500} fontSize={1} is="label">
      {label}
    </Type>
    <Flex position="relative" width="100%">
      {copy ? (
        <Copy position="absolute" height="100%" value={value} right={0} />
      ) : null}
      {overlay ? (
        <Type
          pr={4}
          position="absolute"
          height={"100%"}
          display="inline-flex"
          alignItems="center"
          top="0"
          right={0}
          color="hsl(205, 30%, 70%)"
        >
          {overlay}
        </Type>
      ) : null}
      <Input
        width="100%"
        flexGrow={1}
        disabled={disabled}
        bg={disabled ? "blue.light" : undefined}
        value={value}
        {...rest}
      />
    </Flex>
  </Flex>
);

const BalanceField = ({ value, ...rest }) => (
  <Flex flexDirection={"column"} pb={5}>
    <Type pb={2} fontWeight={500} fontSize={1} is="label">
      Available to Send
    </Type>
    <Flex
      border={1}
      borderColor="blue.mid"
      bg="blue.light"
      borderRadius={6}
      overflow="hidden"
    >
      <Flex px={3} height={48} flexGrow={1} alignItems="center">
        Stacks Balance
      </Flex>
      <Flex
        alignItems="center"
        px={3}
        height={48}
        borderLeft={1}
        borderColor="blue.mid"
        bg="white"
      >
        <Type>{formatStx(value)}</Type>
        <Type color="hsl(205, 30%, 70%)" pl={2}>
          STX
        </Type>
      </Flex>
    </Flex>
  </Flex>
);

export { Field, BalanceField, Label };
