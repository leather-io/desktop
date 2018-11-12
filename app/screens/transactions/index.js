import React from "react";
import { Flex, Type, Card, Input } from "blockstack-ui/dist";
import { Sidebar } from "@components/sidebar";
import { TxItem } from "@components/transaction-item";
import { TxList } from "@components/transaction-list";

const arr = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20
];

const Content = ({ ...rest }) => (
  <Flex flexDirection="column" flexShrink={0} flexGrow={1} {...rest} />
);
const Transactions = ({ ...rest }) => (
  <Flex bg="blue.light" flexGrow={1}>
    <Sidebar />
    <Content p={3}>
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
        flexShrink={0}
        py={4}
        height={80}
      >
        <Type fontSize={4} pr={8}>Transactions</Type>
        <Input minWidth={400} placeholder="Search Transactions..." />
      </Flex>
      <TxList title="All Transactions">
        {arr.map((item, i) => (
          <TxItem key={i} last={arr.length === item} />
        ))}
      </TxList>
    </Content>
  </Flex>
);

export default Transactions;
