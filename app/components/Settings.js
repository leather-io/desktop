// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Blob from '../components/Blob'
import { CopyToClipboard } from 'react-copy-to-clipboard';

type Props = {};

export default class Settings extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)
  }

  render() {

    const { 
      btcAddress,
      reset,
      done
    } = this.props

    return (
      <div>
        <div>
          <p>BTC Address</p>
          {btcAddress}
        </div>
        <br/><br/>
        <Button onClick={reset} height={25}>
          Reset Wallet
        </Button>

        <ActionButtons>
          <Button to="/dashboard">Done</Button>
        </ActionButtons>

      </div>
    );
  }
}
