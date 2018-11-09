// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Blob from '../components/Blob'
import { CopyToClipboard } from 'react-copy-to-clipboard';

type Props = {};

export default class SendConfirmation extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)
  }

  render() {

    const { 
      address,
      amount,
      confirm,
      cancel
    } = this.props

    return (
      <div>
        <div>
          <p>Confirm transaction</p>
        </div>
        Sending {amount} Stacks to 
        <Blob>{address}</Blob>
        <ActionButtons>
          <Button to="/dashboard">Cancel</Button>
          <Button onClick={confirm}>Confirm</Button>
        </ActionButtons>

      </div>
    );
  }
}
