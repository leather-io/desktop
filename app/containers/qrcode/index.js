import React from "react";
import Qr from "qrcode.react";
import { theme } from "blockstack-ui";
import { connect } from "react-redux";
import {
  selectWalletStacksAddress,
  selectWalletBitcoinAddress
} from "@stores/selectors/wallet";
const mapStateToProps = state => ({
  stx: selectWalletStacksAddress(state),
  btc: selectWalletBitcoinAddress(state)
});
const QrCode = ({ value, ...rest }) => (
  <Qr fgColor={theme.colors.blue.dark} value={value} size={300} {...rest} />
);



const ConnectedQrCode = connect(mapStateToProps)(
  ({ btc, stx, type = "stx", ...rest }) => {
    const value = type === "btc" ? btc : stx;
    return <QrCode value={value} {...rest} />;
  }
);

export { ConnectedQrCode, QrCode };
