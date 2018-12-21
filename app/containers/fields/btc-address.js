import React from "react";
import { Field } from "@components/field";
import { connect } from "react-redux";
import {
  selectWalletStacksAddress,
  selectWalletBitcoinAddress,
} from "@stores/selectors/wallet";

const mapStateToProps = state => ({
  stx: selectWalletStacksAddress(state),
  btc: selectWalletBitcoinAddress(state)
});
const BtcField = connect(mapStateToProps)(({ btc, ...rest }) => (
  <Field
    width={1}
    label="Bitcoin Address"
    value={btc}
    disabled
    copy
    {...rest}
  />
));

export { BtcField };
