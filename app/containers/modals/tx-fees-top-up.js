import React from "react";
import { Flex, Type, Button, Buttons } from "blockstack-ui/dist";
import { ConnectedQrCode } from "@containers/qrcode";
import { State } from "react-powerplug";
import { Modal } from "@components/modal";
import { BtcField } from "@containers/fields/btc-address";

const TxFeesModal = ({ hide }) => (
  <Modal
    title="Top Up"
    hide={hide}
    maxWidth={"560px"}
    p={0}
    position={"relative"}
  >
    <State initial={{ view: "warning" }}>
      {({ state, setState }) => (
        <>
          {state.view === "warning" ? (
            <Flex
              zIndex={999}
              position="absolute"
              width={1}
              height={"calc(100% - 59px)"}
              left={0}
              top={49}
              bg={"white"}
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              textAlign="center"
              px={7}
              py={4}
            >
              <Type pb={4} fontSize={4} lineHeight={1.5}>
                Bitcoin is only used to pay fees for Stacks transactions. You
                will not be able to send Bitcoin from this wallet.
              </Type>
              <Button
                onClick={() =>
                  setState({
                    view: "top-up"
                  })
                }
                height={"auto"}
                py={2}
              >
                Continue
              </Button>
            </Flex>
          ) : null}
          <Flex
            p={4}
            borderBottom={1}
            borderColor="blue.mid"
            alignItems="center"
            justifyContent="center"
            width={1}
            bg="blue.light"
          >
            <ConnectedQrCode type="btc" />
          </Flex>
          <Flex p={4} width={1}>
            <BtcField />
          </Flex>
        </>
      )}
    </State>
  </Modal>
);

export { TxFeesModal };
