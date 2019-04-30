import React from "react";
import { Button, Type, Flex, Card } from "blockstack-ui";
import { HardwareSteps } from "@containers/hardware-steps";
import { ledgerSteps } from "@screens/onboarding/hardware-wallet/ledger";
import { trezorSteps } from "@screens/onboarding/hardware-wallet/trezor";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { decodeRawTx } from "@utils/stacks";
import { ERRORS } from "@common/lib/transactions";
import { Field } from "@components/field";
import { Seed } from "@components/seed/index";

const SeedView = ({
  wrapper: Wrapper,
  nextView,
  goToView,
  prevView,
  children,
  type,
  hide,
  doSignTransaction,
  state,
  sender,
  setState,
  handleSeedChange,
  handleSeedValidation,
  clearSeed,
  ...rest
}) => {
  const handleKeyPress = (event) => {
    if(event.key === ' ') {
      event.preventDefault()
    }
  }
  const handleSubmit = async () => {
    setState({
      processing: true
    });
    try {      
      const tx = await doSignTransaction(
        sender,
        state.values.recipient,
        state.values.amount,
        type,
        state.values.seedArray.join(' '),
        state.values.memo || ""
      );

      if (tx && tx.error) {
        console.log("error");
        console.log(tx);
        if (
          tx.error.message &&
          tx.error.message.includes("Not enough UTXOs to fund. Left to fund: ")
        ) {
          const difference = Number(
            tx.error.message.replace(
              "Not enough UTXOs to fund. Left to fund: ",
              ""
            )
          );
          setState({
            errors: {
              ...ERRORS.INSUFFICIENT_BTC_BALANCE,
              difference
            }
          });
        }
        return;
      }
      const decoded = await decodeRawTx(tx.rawTx);

      setState(
        {
          tx: {
            ...tx,
            decoded
          }
        },
        () => nextView()
      );
    } catch (e) {
      console.log("caught error, processing done");
      setState({
        processing: false
      });
    }
  };
  return children ? (
    <Wrapper hide={hide} p={0} pb="15px">
      <Flex flexDirection="column" bg="#F1F6F9" mx="0px" mb="15px">
        <Flex flexDirection="column" alignItems="left" pt={4} px="28px">
          <Type fontSize={3}>
            Enter your seed phrase
          </Type>
        </Flex>
        <Flex flexDirection="column" alignItems="center" mt="-15px" px="15px">
          <Seed 
            isInput={true}
            numWords={12} 
            handleKeyPress={handleKeyPress}
            handleChange={(event, index) => handleSeedChange(event, setState, index)}
            values={state.values.seedArray}
            invert={true}
            small={true}
            mt="25px"
          />
        </Flex>
      </Flex>
      {state.errors && 
        <Flex 
          flexDirection="column" 
          alignItems="center" 
          mt="5px" 
          mb="15px" 
          color="hsl(10, 85%, 50%)"
        >
          {state.errors.seed}
        </Flex> 
      }
      {children
        ? children({
            next: {
              props: {
                disabled: state.processing
              },
              label: state.processing ? "Processing..." : "Continue",
              action: () => {
                if (!state.processing) {
                  handleSeedValidation(
                    sender,
                    state.values,
                    setState,
                    handleSubmit,
                    type
                  )
                }
              },
            },
            secondary: {
              label: "Cancel",
              action: () => {
                clearSeed(setState);
                goToView(0);
                setState({
                  tx: null
                });
              }
            }
          })
        : null}
    </Wrapper>
  ) : null;
};
export { SeedView };
