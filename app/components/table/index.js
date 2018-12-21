import React from "react";
import { Flex } from "blockstack-ui/dist";

const ThItem = ({ ...rest }) => (
  <Flex
    fontWeight="500"
    fontSize={"12px"}
    width={60}
    py={2}
    px={2}
    flexShrink={0}
    {...rest}
  />
);

const TableHeader = ({ items, ...rest }) => {
  return (
    <Flex
      bg="blue.light"
      borderBottom={1}
      borderColor="blue.mid"
      width={1}
      flexGrow={0}
      flexShrink={0}
      color="hsl(205, 30%, 70%)"
      {...rest}
    >
      {items.map(({ label, ...props }, i) => (
        <ThItem key={i} {...props}>
          {label}
        </ThItem>
      ))}
    </Flex>
  );
};

export { TableHeader };
