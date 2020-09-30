import React from "react";
import { Flex, Box, Type, Button } from "blockstack-ui/dist";
import { satoshisToBtc } from "@utils/utils";

import { connect } from "react-redux";
import { selectWalletBitcoinBalance } from "@stores/selectors/wallet";

import { StaticField, Label } from "@components/field";
import { TopSection, BottomSection } from "@containers/modals/withdraw/common";

const mapStateToProps = state => ({
  balance: selectWalletBitcoinBalance(state)
});

export const SuccessScreen = connect(mapStateToProps)(
  ({ hide, recipient, rawTx, transaction, balance }) => (
    <>
      <TopSection>
        <Type fontSize={4} lineHeight={1.5}>
          Transaction Sent!
        </Type>
      </TopSection>
      <BottomSection>
        <Flex pb={4} flexDirection="column">
          <Label>Amount Sent</Label>
          <Type fontSize={4}>{satoshisToBtc(balance - rawTx.fee)} BTC</Type>
          <Label pt={3}>Fee</Label>
          <Type>{satoshisToBtc(rawTx.fee)} BTC</Type>
        </Flex>
        <Flex flexDirection="column">
          <StaticField label="Recipient" value={recipient} />
          <StaticField
            label="Tx Hash"
            value={transaction}
            link={`https://explorer.blockstack.org/tx/${transaction}`}
          />
        </Flex>
        <Box mx="auto">
          <Button onClick={hide}>Close</Button>
        </Box>
      </BottomSection>
    </>
  )
);
