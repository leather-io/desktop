// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import StyledInput from '../components/Input'

type Props = {};

export default class Ledger extends Component<Props> {
  props: Props;

  render() {

    const { 
      getLedgerAddress,
      processing,
      error
    } = this.props

    return (
      <div>
        {error && <StyledInput.ErrorText>{error}</StyledInput.ErrorText>}
        <p>
          1. Connect your Ledger to your computer via USB.
        </p>
        <p>
          2. Unlock Ledger by entering your PIN.
        </p>
        <p>
          3. Select the Bitcoin app on your Ledger.
        </p>
        <p>
          4. Make sure you have "Browser Support" set to no.
        </p>
        <p>
          5. Press the Next button.
        </p>
        <ActionButtons>
          <Button onClick={this.props.back}>Back</Button>
          <Button onClick={this.props.getLedgerAddress} disabled={processing}>{processing ? 'Processing...' : 'Next'}</Button>
        </ActionButtons>
      </div>
    );
  }
}
