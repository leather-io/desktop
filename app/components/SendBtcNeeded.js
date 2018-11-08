// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Blob from '../components/Blob'
import { CopyToClipboard } from 'react-copy-to-clipboard';

type Props = {};

export default class SendBtcNeeded extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)
  }

  render() {

    const { 
      btcAddress,
      minBtcAmount,
      tryAgain,
    } = this.props

    return (
      <div>
        <div>
          <p>Bitcoin needed</p>
        </div>
        <br/><br/>
        <p>
          You don't have enough Bitcoin to fund this transaction. <br/>
          Send at least {minBtcAmount} bitcoin to your bitcoin wallet and try again.<br/>
          Bitcoin is used for Stacks transaction fees. 
          <a href="">Why is BTC required?</a>
        </p>
        <h2>Bitcoin Wallet Address</h2>
        <p>
          {btcAddress}
        </p>
        <ActionButtons>
          <Button to="/send">Cancel</Button>
          <Button onClick={tryAgain}>Try again</Button>
        </ActionButtons>

      </div>
    );
  }
}
