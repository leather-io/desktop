import React from "react";
import { Button, Buttons, Flex, Type } from "blockstack-ui/dist";
import { Modal } from "@components/modal";
import { Label } from "@components/field";
import { Value } from "@components/stacks";
import { TypeIcon } from "@components/transaction-item";
import { StaticField } from "@components/field";

const TxAmounts = ({ amount, fees, ...rest }) => (
  <Flex py={4} px={6} flexDirection="column" justifyContent="center">
    <Label>Amount</Label>
    <Flex>
      <Value fontSize={6} amount={amount} micro suffix="STX" />
    </Flex>
    <Label pt={4} pb={0}>
      Fees
    </Label>
    <Value fontSize={2} fontWeight={500} amount={fees} suffix="BTC" satoshis />
  </Flex>
);

const OperationTypeSection = ({ item, stx, ...rest }) => (
  <Flex
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    py={4}
    px={6}
    flexShrink={0}
    borderRight={1}
    borderColor="blue.mid"
    alignSelf={"stretch"}
  >
    <TypeIcon mb={2} size={72} item={item} stx={stx} />
    <Label pb={0}>{item.sender === stx ? "Sent" : "Received"}</Label>
    <Label pb={0}>Stacks</Label>
  </Flex>
);

const TxDetailsModal = ({ hide, visible, tx, stx, ...rest }) => {
  const {
    sender,
    block_id,
    txid,
    consensusHash,
    valueStacks,
    value: amount,
    scratchData,
    tokenAmount,
    recipientBitcoinAddress,
    recipient,
    operation,
    memo,
    fees
  } = tx;

  const items = [
    {
      label: "Sender",
      value: sender && typeof sender === "string" ? sender : sender.stx,
      link: `https://explorer.blockstack.org/address/stacks/${
        sender && typeof sender === "string" ? sender : sender.stx
      }`
    },
    {
      label: "Recipient",
      value: recipient,
      link: `https://explorer.blockstack.org/address/stacks/${recipient}`
    },
    {
      label: "BTC Transaction",
      value: txid,
      link: `https://explorer.blockstack.org/tx/${txid}`
    },
    {
      label: "BTC Block",
      value: block_id,
      link: `https://explorer.blockstack.org/block/${block_id}`
    },
    { label: "Memo", value: memo || scratchData }
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
          borderRadius={6}
          border={1}
          borderColor="blue.mid"
          alignItems="center"
          flexShrink={0}
          boxShadow="card"
        >
          <OperationTypeSection item={tx} stx={stx} />
          <TxAmounts fees={fees} satoshis amount={tokenAmount || amount} />
        </Flex>
      </Flex>
      <Flex flexDirection="column" p={4} pb={0} flexShrink={0}>
        {items.map(({ label, value, link }, i) =>
          value && value !== "" ? (
            <StaticField key={i} label={label} value={value} link={link} />
          ) : null
        )}
      </Flex>
    </Modal>
  );
};

export { TxDetailsModal };
