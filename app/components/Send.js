// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Input from '../containers/Input'

type Props = {
  // name: PropTypes.string,
  // handleNameChange: PropTypes.func,
};

export default class Send extends Component<Props> {
  props: Props;

  render() {

    const {
      address,
      amount,
      addressError,
      amountError
    } = this.props

    return (
      <div>
        <Input 
          label="To address" 
          type="text" 
          name="address" 
          value={address} 
          error={addressError}
          onChange={this.props.handleAddressChange} 
          onReturn={this.props.next}
        />
        <Input 
          label="Amount (Stacks)" 
          type="text" 
          name="amount" 
          value={amount} 
          error={amountError}
          onChange={this.props.handleAmountChange} 
          onReturn={this.props.next}
        />
        <ActionButtons>
          <Button to="/dashboard">Back</Button>
          <Button onClick={this.props.next}>Send</Button>
        </ActionButtons>
      </div>
    );
  }
}
