import React from "react";
import { Flex, Type, Card } from "blockstack-ui/dist";
import { TxItem } from "@components/transaction-item";
import { LayersOffOutlineIcon } from "mdi-react";
const Empty = ({ ...rest }) => (
  <Flex
    flexGrow={1}
    alignItems="center"
    justifyContent={"center"}
    color="hsl(205, 30%, 70%)"
    flexDirection="column"
  >
    <LayersOffOutlineIcon size={80} />
    <Flex pt={3}>
      <Type fontSize={2} fontWeight={700}>
        No Transaction History
      </Type>
    </Flex>
  </Flex>
);

const data = {
  walletType: "trezor",
  address: "SP1XE0QK5JYMY3TH4YBQ0V56Z3DHG0G34C44930VF",
  btcAddress: "1CCiDpMj5fPid1Gs6pRt6zRJh3LHgobgpk",
  stacksBalance: { "0": 90, t: 1, s: 0 },
  btcBalance: { "0": 74604, t: 1, s: 0 },
  stacksTransactions: [
    {
      address: "mrifWsShtgpyQ7kUpPQFvuddZ2vzbDaQxc",
      block_id: 549703,
      credit_value: "100",
      debit_value: "10",
      lock_transfer_block_id: 0,
      txid: "fca73d510b083311291623773a69febf0dd236e395f1aeab64bf197ce0111ad9",
      type: "STACKS",
      vtxindex: 1091,
      operationType: "$",
      consensusHash: "038a1541a4f314ae37cf3e43d3ad3e54",
      tokenType: "STACKS",
      tokensSent: "10",
      scratchData: "",
      recipientBitcoinAddress: "1BXSdgcRLtrjw5AXZPe1eawmQr75qckfMo",
      recipient: "SP1SQ68HK9N4GFT3CG694FBFAYWS28C39NF1TZG9X",
      tokenSentHex: "000000000000000a",
      tokensSentSTX: "0",
      operation: "SENT"
    },
    {
      address: "mrifWsShtgpyQ7kUpPQFvuddZ2vzbDaQxc",
      block_id: 549412,
      credit_value: "100",
      debit_value: "0",
      lock_transfer_block_id: 0,
      txid: "88c002771b2fd17bbf8162e41e37646564408464ff08143719a19699518f60ea",
      type: "STACKS",
      vtxindex: 726,
      operationType: "$",
      consensusHash: "d78a1df54bbdf3843a1c9277fd3ea9b3",
      tokenType: "STACKS",
      tokensSent: "100",
      scratchData: "E pur si muove",
      recipientBitcoinAddress: "1CCiDpMj5fPid1Gs6pRt6zRJh3LHgobgpk",
      recipient: "SP1XE0QK5JYMY3TH4YBQ0V56Z3DHG0G34C44930VF",
      tokenSentHex: "0000000000000064",
      tokensSentSTX: "0",
      operation: "RECEIVED"
    }
  ]
};

const TxList = ({
  children,
  items = data.stacksTransactions,
  contentHeader,
  title,
  action,
  ...rest
}) => (
  <Card p={0} flexGrow={1} bg="blue.light">
    <Flex
      justifyContent={"space-between"}
      borderBottom="1px solid"
      borderColor={"blue.mid"}
      px={4}
      py={3}
      borderRadius="6px 6px 0 0"
      flexShrink={0}
      bg="white"
    >
      <Type fontWeight={500}>{title}</Type>
      {action ? <Type color="hsl(205, 30%, 70%)">{action}</Type> : null}
    </Flex>
    {items && items.length && contentHeader ? contentHeader : null}
    <Flex flexDirection="column" overflow="auto" flexGrow={1}>
      {items && items.length ? (
        items.map((item, i) => <TxItem key={i} last={items.length === item} item={item} />)
      ) : (
        <Empty />
      )}
    </Flex>
  </Card>
);

export { TxList };
