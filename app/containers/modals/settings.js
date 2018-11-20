import React from "react";
import { Button, Buttons, Flex, Type } from "blockstack-ui/dist";
import { State } from "react-powerplug";
import { Modal } from "@components/modal";
import { Label } from "@components/field";
import { StaticField } from "@components/field";
import { doResetWallet } from "@stores/actions/wallet";
import { OpenModal } from "@components/modal";
import { TxFeesModal } from "@containers/modals/tx-fees-top-up";
import { connect } from "react-redux";
import { selectWalletType } from "@stores/selectors/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";

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

const TopUpSection = connect(state => ({
  type: selectWalletType(state)
}))(({ type, ...rest }) =>
  type !== WALLET_TYPES.WATCH_ONLY ? (
    <Section>
      <Label pb={4} fontSize={2}>
        Transaction Fees
      </Label>
      <Card>
        <Flex p={4} borderRight={1} borderColor="blue.mid" flexGrow={1}>
          <Type>
            Bitcoin is used to pay transaction fees for Stacks transactions. You
            have enough BTC to process 100 transactions.
          </Type>
        </Flex>
        <Flex justifyContent="center" p={4}>
          <OpenModal component={TxFeesModal}>
            {({ bind }) => (
              <Button height={"auto"} py={2} {...bind}>
                Top Up
              </Button>
            )}
          </OpenModal>
        </Flex>
      </Card>
    </Section>
  ) : null
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
const DangerZone = connect(
  null,
  { doResetWallet }
)(({ doResetWallet, hide, ...rest }) => (
  <Section>
    <Label pb={4} fontSize={2}>
      Danger Zone
    </Label>
    <Card>
      <Flex
        p={4}
        flexDirection="column"
        borderRight={1}
        borderColor="blue.mid"
        flexGrow={1}
      >
        <Label>Reset Wallet</Label>
        <Type>
          This will remove all data and you’ll have to restore it to gain
          access.
        </Type>
      </Flex>
      <Flex justifyContent="center" alignItems="center" p={4}>
        <State initial={{ clicked: false }}>
          {({ state, setState }) => {
            if (state.clicked) {
              return (
                <Button
                  onClick={() => {
                    hide();
                    doResetWallet();
                  }}
                  height={"auto"}
                  py={2}
                >
                  Are you sure?
                </Button>
              );
            }
            return (
              <Button
                onClick={() => {
                  setState({ clicked: true });
                }}
                height={"auto"}
                py={2}
              >
                Reset Wallet
              </Button>
            );
          }}
        </State>
      </Flex>
    </Card>
  </Section>
));
const SettingsModal = ({ hide, ...rest }) => {
  return (
    <Modal title="Settings" hide={hide} p={0} width="90vw">
      <TopUpSection />
      <DangerZone hide={hide} />
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
