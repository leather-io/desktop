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

    this.state = {
      receiveButtonText: 'Receive',
    }
  }

  addressCopied = () => {
    this.setState({
      receiveButtonText: 'Address Copied!',
    })

    setTimeout(() => {
      this.setState({
        receiveButtonText: 'Receive',
      })
    }, 1500)
  }

  render() {

    const { 
      address,
      stacksBalance,
      btcBalance,
      refresh,
      logout
    } = this.props

    return (
      <div>
        <div>
          <p>Balance</p>
          <h2>{microToStacks(stacksBalance)} Stacks</h2>
          <br/>
          <p>Address</p>
          {address}
          {/*{btcBalance} Bitcoin*/}
        </div>
{/*        <Button onClick={refresh}>Refresh</Button>
        <Button onClick={logout}>Sign Out</Button>*/}
        <br/><br/>
        <Button to="/send" height={35}>
          Send
        </Button>
        &nbsp;
        <CopyToClipboard text={address}>
          <Button onClick={this.addressCopied} height={25}>
            {this.state.receiveButtonText}
          </Button>
        </CopyToClipboard>


{/*        <Button to="/send" height={25} small>
          Send
        </Button>
        <Button to="/send" height={25} small>
          Receive
        </Button>*/}

        <ActionButtons>
          {/*<Button to="/send">Send</Button>*/}
          {/*<Button to="/send">Receive</Button>*/}
          <Button onClick={refresh}>Refresh</Button>
          <Button to="/settings">Settings</Button>
        </ActionButtons>

      </div>
    );
  }
}
