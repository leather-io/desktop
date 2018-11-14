import React from "react";
import { Button, Buttons, Flex, Type } from "blockstack-ui/dist";
import { Modal } from "@components/modal";
import { Label } from "@components/field";
import { StaticField } from "@components/field";

const Card = ({ ...rest }) => (
  <Flex
    width={1}
    bg="white"
    borderRadius={6}
    border={1}
    borderColor="blue.mid"
    alignItems="center"
    flexShrink={0}
    {...rest}
  />
);

const Section = ({ ...rest }) => (
  <Flex
    p={4}
    borderBottom={1}
    borderColor="blue.mid"
    bg="blue.light"
    flexShrink={0}
    flexDirection="column"
    {...rest}
  />
);
const TopUpSection = ({ ...rest }) => (
  <Section>
    <Label pb={4} fontSize={2}>
      Transaction Fees
    </Label>
    <Card>
      <Flex alignItems="center">
        <Flex width={0.7} p={4} borderRight={1} borderColor="blue.mid">
          <Type>
            Bitcoin is used to pay transaction fees for Stacks transactions. You
            have enough BTC to process 100 transactions.
          </Type>
        </Flex>
        <Flex justifyContent="center" width={0.4} p={4}>
          <Button height={"auto"} py={2}>
            Top Up
          </Button>
        </Flex>
      </Flex>
    </Card>
  </Section>
);

const API = ({ ...rest }) => (
  <Section>
    <Label pb={4} fontSize={2}>
      Wallet Info
    </Label>
    <Flex>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis,
      debitis dignissimos dolores doloribus, earum facere in laborum
      necessitatibus nihil odit officia officiis optio possimus quam quas
      repellat sequi soluta vel?
    </Flex>
  </Section>
);
const DangerZone = ({ ...rest }) => (
  <Section>
    <Label pb={4} fontSize={2}>
      Danger Zone
    </Label>
    <Card>
      <Flex alignItems="center">
        <Flex
          p={4}
          flexDirection="column"
          borderRight={1}
          borderColor="blue.mid"
          width={0.7}
        >
          <Label>Reset Wallet</Label>
          <Type>
            This will remove all data and you’ll have to restore it to gain
            access.
          </Type>
        </Flex>
        <Flex justifyContent="center" width={0.4} p={4}>
          <Button height={"auto"} py={2}>
            Reset Wallet
          </Button>
        </Flex>
      </Flex>
    </Card>
  </Section>
);
const SettingsModal = ({ hide, ...rest }) => {
  return (
    <Modal title="Settings" hide={hide} p={0} width="90vw">
      <TopUpSection />
      <DangerZone />
      <API />
      <Flex flexDirection="column" p={4} flexShrink={0}>
        <Buttons>
          <Button height={"auto"} py={2} onClick={hide}>
            Close
          </Button>
        </Buttons>
      </Flex>
    </Modal>
  );
};

export { SettingsModal };
