import React from "react";
import { Button, Flex, Type } from "blockstack-ui/dist";
import { Modal } from "@components/modal";
import { Label } from "@components/field";
import { Value } from "@components/stacks";
import { TypeIcon } from "@components/transaction-item";

const TxDetailsModal = ({ hide, visible, tx, ...rest }) => {
  const {
    address,
    block_id,
    txid,
    consensusHash,
    tokensSent,
    scratchData,
    recipientBitcoinAddress,
    recipient,
    operation
  } = tx;

  const items = [
    { label: "Sender (Stacks)", value: address },
    { label: "Recipient (Stacks)", value: recipient },
    { label: "Recipient (BTC)", value: recipientBitcoinAddress },
    { label: "Tx ID", value: txid },
    { label: "Block ID", value: block_id },
    { label: "Consensus Hash", value: consensusHash },
    { label: "Note", value: scratchData }
  ];
  return (
    <Modal title="Transaction Details" hide={hide} p={0}>
      <Flex
        p={4}
        borderBottom={1}
        borderColor="blue.mid"
        bg="blue.light"
        alignItems="center"
        flexShrink={0}
      >
        <Flex
          width={1}
          bg="white"
          p={4}
          borderRadius={6}
          border={1}
          borderColor="blue.mid"
          alignItems="center"
          flexShrink={0}
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            pr={4}
            flexShrink={0}
          >
            <Label>
              {operation === "SENT" ? "Sent Stacks" : "Received Stacks"}
            </Label>
            <TypeIcon type={operation} />
          </Flex>
          <Flex flexDirection="column" justifyContent="center">
            <Label>Amount</Label>
            <Flex py={3}>
              <Value amount={tokensSent} micro />
            </Flex>
            <Label>Fees</Label>
            <Flex pt={2}>
              <Value fontSize={1} amount={tokensSent} micro />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDirection="column" p={4} flexShrink={0}>
        {items.map(
          ({ label, value }, i) =>
            value && value !== "" ? (
              <Flex pb={3} flexDirection="column" key={i} flexShrink={0}>
                <Label>{label}</Label>
                <Flex
                  border={1}
                  borderColor="blue.mid"
                  bg="blue.light"
                  p={2}
                  overflow="auto"
                >
                  <Type fontFamily="brand">{value}</Type>
                </Flex>
              </Flex>
            ) : null
        )}
        <Button onClick={hide}>Close</Button>
      </Flex>
    </Modal>
  );
};

export { TxDetailsModal };
