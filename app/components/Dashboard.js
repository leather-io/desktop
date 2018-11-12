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

  renderTransaction = (tx) => {
    return (<div>

    </div>)
  }

  render() {

    const { 
      address,
      stacksBalance,
      transactions,
      refresh,
      logout,
      walletType
    } = this.props

    const sendDisabled = walletType === 'watch-only'

    return (
      <div>
        <div>
          <p>Available Balance</p>
          <h2>{microToStacks(stacksBalance.toString())} Stacks</h2>
          <br/>
          <p>Address</p>
          <Blob>{address}</Blob>
        </div>
        <br/>
        {sendDisabled && 
          <div>This is a watch-only wallet, sending is disabled.<br/><br/><br/></div>
        }
        {sendDisabled ?
            <Button to="/send" height={35} disabled title="Test">
              Send
            </Button>
          :
            <Button to="/send" height={35}>
              Send
            </Button>
          }
          &nbsp;
          <CopyToClipboard text={address}>
            <Button onClick={this.addressCopied} height={25}>
              {this.state.receiveButtonText}
            </Button>
          </CopyToClipboard>

          {transactions && transactions.length > 0 && <p>Recent Transactions</p>}
          {transactions.map((tx) => {
            return <Blob key={tx.txid}>
              {tx.operation} {microToStacks(tx.tokensSent)} Stacks<br/>
              {tx.recipient}<br/>
            </Blob>
          })}

        <ActionButtons>
          <Button onClick={refresh}>Refresh</Button>
          <Button to="/settings">Settings</Button>
        </ActionButtons>

      </div>
    );
  }
}
