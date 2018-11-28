import React from "react";
import { State } from "react-powerplug";
import { BitcoinIcon, NoEntryIcon, UsbIcon, LockIcon } from "mdi-react";
import { Flex } from "blockstack-ui/dist";

const steps = [
  {
    value: `Please connect your Ledger to your computer via USB.`,
    icon: UsbIcon
  },
  {
    value: "Unlock your Ledger by entering your PIN.",
    icon: LockIcon
  },
  {
    value: "Select the Bitcoin App on your Ledger.",
    icon: BitcoinIcon
  },
  {
    value: `Make sure you have "Browser Support" set to no.`,
    icon: NoEntryIcon
  }
];

const HardwareSteps = ({ steps, ...rest }) => (
  <State initial={{ step: 0 }}>
    {({ state, setState }) => {
      const { value, icon: Icon } = steps[state.step];
      return (
        <Flex>
          <Flex>
            <Icon />
          </Flex>
          <Flex>{value}</Flex>
        </Flex>
      );
    }}
  </State>
);

const LedgerSteps = ({ ...rest }) => (
  <State initial={{ step: 0 }}>
    {({ state, setState }) => {
      const { value, icon: Icon } = steps[state.step];
      return (
        <Flex>
          <Flex>
            <Icon />
          </Flex>
          <Flex>{value}</Flex>
        </Flex>
      );
    }}
  </State>
);
