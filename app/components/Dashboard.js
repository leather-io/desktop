// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Blob from '../components/Blob'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { microToStacks } from '../utils/utils'

type Props = {};

export default class Dashboard extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)
  }

  render() {

    const { 
      address,
      stacksBalance,
      btcBalance,
      refresh
    } = this.props

    return (
      <div>
        <div>
          <p>Your Stacks Address:</p>
          {address}
          <p>Your Balance:</p>
          <h2>{microToStacks(stacksBalance)} Stacks</h2>
          {/*{btcBalance} Bitcoin*/}
        </div>
        <Button onClick={refresh}>Refresh</Button>
        <br/><br/>
{/*        <Button to="/send" height={25} small>
          Send
        </Button>
        &nbsp;
        <Button to="/send" height={25} small>
          Receive
        </Button>*/}

        <ActionButtons>
          <Button to="/send">Send</Button>
          <Button to="/send">Receive</Button>
        </ActionButtons>

      </div>
    );
  }
}
