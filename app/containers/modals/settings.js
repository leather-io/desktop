import React from "react";
import { Button, Buttons, Flex, Type } from "blockstack-ui/dist";
import { State } from "react-powerplug";
import { Modal } from "@components/modal";
import { Label } from "@components/field";
import { doResetWallet } from "@stores/actions/wallet";
import { OpenModal } from "@components/modal";
import { TxFeesModal } from "@containers/modals/tx-fees-top-up";
import { connect } from "react-redux";
import {
  selectWalletType,
  selectWalletBitcoinBalance
} from "@stores/selectors/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { satoshisToBtc } from "@utils/utils";

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
  type: selectWalletType(state),
  balance: selectWalletBitcoinBalance(state)
}))(({ type, balance, ...rest }) =>
  type !== WALLET_TYPES.WATCH_ONLY ? (
    <Section>
      <Label pb={4} fontSize={2}>
        Transaction fees
      </Label>
      <Card>
        <Flex p={4} borderRight={1} borderColor="blue.mid" flexGrow={1}>
          <Type>
            You need very small amounts of Bitcoin (BTC) to send Stacks (STX). You
            currently have {satoshisToBtc(balance)} BTC available.
          </Type>
        </Flex>
        <Flex justifyContent="center" p={4}>
          <OpenModal component={TxFeesModal}>
            {({ bind }) => (
              <Button height={"auto"} py={2} {...bind}>
                Add BTC
              </Button>
            )}
          </OpenModal>
        </Flex>
      </Card>
    </Section>
  ) : null
);

const DangerZone = connect(
  null,
  { doResetWallet }
)(({ doResetWallet, hide, ...rest }) => (
  <Section>
    <Label pb={4} fontSize={2}>
    Reset wallet setup
    </Label>
    <Card>
      <Flex
        p={4}
        flexDirection="column"
        borderRight={1}
        borderColor="blue.mid"
        flexGrow={1}
      >
        <Type>
          Resetting removes your Stacks Wallet setup. It does not affect your Stacks addresses or the STX balances on them. You need your seed phrase to gain access to them again. <strong>Make sure you have stored your seed phrase securely.</strong> </Type>
      </Flex>
      <Flex justifyContent="center" alignItems="center" p={4} >
        <State initial={{ clicked: false }}>
          {({ state, setState }) => {
            if (state.clicked) {
              return (
                <Button
                  onClick={() => {
                    hide();
                    setTimeout(() => doResetWallet(), 300);
                  }}
                  height={"auto"}
                  py={2}
                  bg="#EF4813"
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
                bg="#EF4813"
              >
                Reset wallet
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
