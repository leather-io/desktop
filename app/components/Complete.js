// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Blob from '../components/Blob'
import { CopyToClipboard } from 'react-copy-to-clipboard';

type Props = {};

export default class CompleteView extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      addressCopyButtonText: 'Copy',
      payloadCopyButtonText: 'Copy',
      showPublicKey: false,
      publicKeyToggleButtonLabel: 'Show Public Key'
    }
  }

  addressCopied = () => {
    this.setState({
      addressCopyButtonText: 'Copied!',
    })

    setTimeout(() => {
      this.setState({
        addressCopyButtonText: 'Copy',
      })
    }, 2000)
  }

  payloadCopied = () => {
    this.setState({
      payloadCopyButtonText: 'Copied!',
    })

    setTimeout(() => {
      this.setState({
        payloadCopyButtonText: 'Copy',
      })
    }, 2000)
  }

  togglePublicKey = () => {
    var label = !this.state.showPublicKey ? 'Show Stacks Address' : 'Show Public Key'
    this.setState({
      showPublicKey: !this.state.showPublicKey,
      publicKeyToggleButtonLabel: label
    })
  }

  render() {

    const { 
      address,
      payload,
      publicKey
    } = this.props

    return (
      <div>
        <p>
          You're almost done! To complete the process, return to the Coinlist web page and paste the following information into the corresponding fields.
        </p>

        { !this.state.showPublicKey ? 
          <div>
            <p>Your Stacks Address:</p>
            <Blob>
              {address}
            </Blob>
          </div>
          :
          <div>
            <p>Your Public Key:</p>
            <Blob>
              {publicKey}
            </Blob>
          </div>
        }

        <CopyToClipboard text={this.state.showPublicKey ? publicKey : address}>
          <Button onClick={this.addressCopied} height={25} small>
            {this.state.addressCopyButtonText}
          </Button>
        </CopyToClipboard>
        &nbsp;
        {publicKey &&
          <Button onClick={this.togglePublicKey} height={25} small>
            {this.state.publicKeyToggleButtonLabel}
          </Button>
        }

        <p>Verification Code:</p>
        <Blob>
          {payload}
        </Blob>
        <CopyToClipboard text={payload}>
          <Button onClick={this.payloadCopied} height={25} small>{this.state.payloadCopyButtonText}</Button>
        </CopyToClipboard>  
        <ActionButtons>
          <Button onClick={() => this.props.next()}>Finish & Exit</Button>
        </ActionButtons>
      </div>
    );
  }
}
