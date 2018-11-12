import React from "react";
import { Flex, Box, Type, Button, Buttons, Card } from "blockstack-ui/dist";
import QrCode from "mdi-react/QrcodeIcon";
import SendIcon from "mdi-react/SendIcon";
import { Sidebar } from "@components/sidebar";
import { Tabs } from "@components/tabs";

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
      <Button icon={SendIcon} width={150} height={"auto"} py={2} mx={2}>
        Send
      </Button>
      <Button icon={QrCode} width={150} height={"auto"} py={2} mx={2}>
        Receive
      </Button>
    </Buttons>
  </Flex>
);

const TxItem = ({ last, ...rest }) => (
  <Flex
    borderBottom={!last ? "1px solid" : undefined}
    borderColor={!last ? "blue.mid" : undefined}
    alignItems={"center"}
    flexShrink={0}
    px={3}
    py={4}
  >
    <Flex pr={4} flexDirection={"column"} alignItems={"center"}>
      <Type>SEP</Type>
      <Type>25</Type>
    </Flex>
    <Flex flexDirection={"column"} flexGrow={1}>
      <Type pb={1} fontWeight={"bold"}>
        Sent Stacks
      </Type>
      <Type>To SPNN289GPP5HQA5ZF2FKQKJM3K2MP...</Type>
    </Flex>
    <Flex>
      <Type>-6,845 STX</Type>
    </Flex>
  </Flex>
);

const TxList = ({ children, ...rest }) => (
  <Card p={0} flexGrow={1}>
    <Flex
      justifyContent={"space-between"}
      borderBottom="1px solid"
      borderColor={"blue.mid"}
      px={4}
      py={3}
      flexShrink={0}
    >
      <Type>Recent Activity</Type>
      <Type opacity={0.5}>See All</Type>
    </Flex>
    <Flex flexDirection="column" overflow="auto" flexGrow={1}>
      {children}
    </Flex>
  </Card>
);

const tabs = [
  {
    label: "General",
    slug: "general",
    children: <Flex p={4}>General</Flex>
  },
  {
    label: "Advanced",
    slug: "advanced",
    children: <Flex p={4}>Advanced</Flex>
  },
  {
    label: "Bitcoin",
    slug: "bitcoin",
    children: <Flex p={4}>Bitcoin</Flex>
  }
];

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Content = ({ ...rest }) => (
  <Flex flexDirection="column" flexShrink={0} flexGrow={1} {...rest} />
);
const Settings = ({ ...rest }) => (
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
        <Type fontSize={4}>Settings</Type>
      </Flex>
      <Card p={0} flexGrow={1}>
        <Tabs tabs={tabs}>
          {({ current, setState }) => {
            return tabs.find(({ slug }) => slug === current).children;
          }}
        </Tabs>
      </Card>
    </Content>
  </Flex>
);

export default Settings;
