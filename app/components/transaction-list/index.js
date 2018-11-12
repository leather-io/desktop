import React from "react";
import { Flex, Type, Card } from "blockstack-ui/dist";
const TxList = ({ children, contentHeader, title, action, ...rest }) => (
  <Card p={0} flexGrow={1}>
    <Flex
      justifyContent={"space-between"}
      borderBottom="1px solid"
      borderColor={"blue.mid"}
      px={4}
      py={3}
      flexShrink={0}
    >
      <Type fontWeight={500}>{title}</Type>
      {action ? <Type color="hsl(205, 30%, 70%)">{action}</Type> : null}
    </Flex>
    {contentHeader ? contentHeader : null}
    <Flex flexDirection="column" overflow="auto" flexGrow={1}>
      {children}
    </Flex>
  </Card>
);

export { TxList };
