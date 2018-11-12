import React from "react";
import { Flex } from "blockstack-ui/dist";
import SettingsIcon from "mdi-react/SettingsIcon";
import { Hover } from "react-powerplug";
import { TxList } from "@components/transaction-list";
import { OpenModal } from "@components/modal";
import { Modal } from "@components/modal";
import { TableHeader } from "@components/table";

import { Balance } from "@containers/balance";

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
const tableHeadItems = [
  {
    label: "Date",
    width: 52
  },
  {
    label: "Details",
    width: 60,
    flexGrow: 1
  },
  {
    label: "Amount",
    mr: 4
  }
];

const balance = 1231231.12312;

const Dashboard = ({ ...rest }) => (
  <Flex bg="blue.light" flexGrow={1}>
    <Content p={3}>
      <Header />
      <Balance value={balance} />
      <TxList
        title="Recent Activity"
        contentHeader={<TableHeader items={tableHeadItems} />}
      />
    </Content>
  </Flex>
);

export default Dashboard;
