import React from "react";
import { Flex, Box, Type, Button, Buttons, Card } from "blockstack-ui/dist";
import { Hover } from "react-powerplug";
import { Link } from "react-router-dom";
import { TransferIcon, WalletIcon, SettingsIcon } from "mdi-react";

const NavItem = ({ active, icon: Icon, to, children, ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Link
        style={{
          textDecoration: "none"
        }}
        to={to}
      >
        <Flex
          pb={4}
          opacity={hovered && !active ? 1 : !active ? 0.5 : undefined}
          cursor={hovered && !active ? "pointer" : undefined}
          alignItems={"center"}
          style={{
            textDecoration: "none"
          }}
          {...bind}
        >
          {Icon ? (
            <Flex
              size={20}
              mr={2}
              alignItems={"center"}
              justifyContent={"center"}
              color={hovered ? "blue.accent" : "white"}
            >
              <Icon size={16} />
            </Flex>
          ) : null}
          <Type fontWeight="500">{children}</Type>
        </Flex>
      </Link>
    )}
  </Hover>
);

const Sidebar = ({ ...rest }) => (
  <Flex pt={7} color={"white"} is="aside" bg="blue.dark" px={5} width={200}>
    <Box>
      <NavItem icon={WalletIcon} to={"/dashboard"}>
        Stacks Wallet
      </NavItem>
      <NavItem icon={TransferIcon} to={"/transactions"}>
        Transactions
      </NavItem>
      <NavItem icon={SettingsIcon} to={"/settings"}>
        Settings
      </NavItem>
    </Box>
  </Flex>
);

export { Sidebar };
