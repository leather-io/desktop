import React from "react";
import { Flex, Box, Type, Button, Buttons, Input } from "blockstack-ui/dist";
import QrCode from "mdi-react/QrcodeIcon";
import SendIcon from "mdi-react/SendIcon";
import SettingsIcon from "mdi-react/SettingsIcon";
import CopyIcon from "mdi-react/ContentCopyIcon";

import { Hover, State } from "react-powerplug";
import { TxItem } from "@components/transaction-item";
import { TxList } from "@components/transaction-list";
import { OpenModal } from "@components/modal";
import { Modal } from "@components/modal";

const TableHeader = () => {
  const ThItem = ({ ...rest }) => (
    <Flex
      fontWeight="500"
      fontSize={1}
      width={60}
      py={2}
      px={2}
      flexShrink={0}
      {...rest}
    />
  );
  return (
    <Flex
      bg="blue.light"
      borderBottom={1}
      borderColor="blue.mid"
      width={1}
      flexGrow={1}
      flexShrink={0}
    >
      <ThItem width={52}>Date</ThItem>
      <ThItem width={60} flexGrow={1}>
        Details
      </ThItem>
      <ThItem mr={4}>Amount</ThItem>
    </Flex>
  );
};

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
        <Type>{value}</Type>
        <Type color="hsl(205, 30%, 70%)" pl={2}>
          STX
        </Type>
      </Flex>
    </Flex>
  </Flex>
);

const Send = ({ ...rest }) => {
  const InitialScreen = props => (
    <State
      initial={{
        values: {
          recipient: "",
          amount: "",
          note: ""
        }
      }}
    >
      {({ state, setState }) => (
        <>
          <Field
            name="recipient"
            label="Recipient"
            placeholder="Enter a Stacks Address"
          />
          <BalanceField value={12352323} />
          <Field
            name="amount"
            overlay="STX"
            label="Amount"
            placeholder="0.00"
          />
          <Field
            name="note"
            label="Note"
            placeholder="Write an optional message..."
          />
        </>
      )}
    </State>
  );

  return (
    <State initial={{ view: "initial" }}>
      {({ state, setState }) => {
        switch (state.view) {
          default:
            return <InitialScreen />;
        }
      }}
    </State>
  );
};

const Copy = ({ value, ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Flex
        onClick={() => console.log("need to copy", value)}
        px={3}
        color="hsl(205, 30%, 70%)"
        alignItems="center"
        justifyContent="center"
        opacity={hovered ? 1 : 0.5}
        cursor="pointer"
        {...bind}
        {...rest}
      >
        <CopyIcon size={18} />
      </Flex>
    )}
  </Hover>
);

/**
 * Field
 * @param {any} label - The label (typically a string)
 * @param {any} overlay - Text to overlay input eg STX
 * @param {boolean} disabled
 * @param {boolean} copy - to enable copy and paste
 */
const Field = ({ label, overlay, disabled, copy, ...rest }) => (
  <Flex flexDirection={"column"} pb={5}>
    <Type pb={2} fontWeight={500} fontSize={1} is="label">
      {label}
    </Type>
    <Flex position="relative" width="100%">
      {copy ? <Copy position="absolute" height="100%" right={0} /> : null}
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
        {...rest}
      />
    </Flex>
  </Flex>
);

const Balance = ({ value = 0, ...rest }) => (
  <Flex
    flexShrink={0}
    width={1}
    flexDirection={"column"}
    alignItems={"center"}
    pt={8}
    pb={7}
  >
    <Flex pb={4} flexDirection={"column"} alignItems={"center"}>
      <Type fontWeight="bold" color="hsl(205, 30%, 70%)">
        Wallet Balance
      </Type>
      <Flex py={6} alignItems={"center"}>
        <Type fontSize={8} fontWeight={300}>
          {value}
        </Type>
        <Type pl={2} fontSize={3} color="hsl(205, 30%, 70%)" fontWeight="bold">
          STX
        </Type>
      </Flex>
    </Flex>
    <Buttons>
      <OpenModal
        component={({ visible, hide }) => (
          <Modal title="Send Stacks" hide={hide}>
            <Send />
            <Buttons>
              <Button>Continue</Button>
            </Buttons>
          </Modal>
        )}
      >
        {({ bind }) => (
          <Button
            icon={SendIcon}
            width={150}
            height={"auto"}
            py={2}
            mx={2}
            {...bind}
          >
            Send
          </Button>
        )}
      </OpenModal>
      <OpenModal
        component={({ visible, hide }) => (
          <Modal title="Receive Stacks" hide={hide}>
            <QrCode />
            <Field
              label="Stacks Address"
              value="STACKS ADDRESS"
              disabled
              copy
            />
          </Modal>
        )}
      >
        {({ bind }) => (
          <Button
            icon={QrCode}
            width={150}
            height={"auto"}
            py={2}
            mx={2}
            {...bind}
          >
            Receive
          </Button>
        )}
      </OpenModal>
    </Buttons>
  </Flex>
);

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Content = ({ ...rest }) => (
  <Flex flexDirection="column" flexShrink={0} flexGrow={1} {...rest} />
);

const SettingsButton = ({ ...rest }) => {
  return (
    <OpenModal
      component={({ visible, hide }) => (
        <Modal title="Settings" hide={hide}>
          Settings!
        </Modal>
      )}
    >
      {({ bind }) => (
        <Hover>
          {({ hovered, bind: hoveredBind }) => (
            <Flex
              position="relative"
              zIndex={999}
              p={2}
              opacity={hovered ? 1 : 0.5}
              cursor={hovered ? "pointer" : undefined}
              {...bind}
              {...hoveredBind}
            >
              <SettingsIcon />
            </Flex>
          )}
        </Hover>
      )}
    </OpenModal>
  );
};

const Header = ({ ...rest }) => {
  return (
    <Flex justifyContent="space-between">
      <Flex p={2} fontWeight={500}>
        Stacks Wallet
      </Flex>
      <SettingsButton />
    </Flex>
  );
};
const Dashboard = ({ ...rest }) => (
  <Flex bg="blue.light" flexGrow={1}>
    <Content p={3}>
      <Header />
      <Balance value={"1,564,856"} />
      <TxList
        title="Recent Activity"
        contentHeader={<TableHeader />}
        action="See All"
      >
        {arr.map((item, i) => (
          <TxItem key={i} last={arr.length === item} />
        ))}
      </TxList>
    </Content>
  </Flex>
);

export default Dashboard;
