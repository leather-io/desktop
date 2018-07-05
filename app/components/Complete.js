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

  render() {

    const { 
      address,
      payload
    } = this.props

    return (
      <div>
        <p>
          You're almost done! To complete the process, return to the Coinlist web page and paste the following information into the corresponding fields.
        </p>
        <p>Your Stacks Address:</p>
        <Blob>
          {address}
        </Blob>
        <CopyToClipboard text={address}>
          <Button onClick={this.addressCopied} height={25} small>{this.state.addressCopyButtonText}</Button>
        </CopyToClipboard>
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
