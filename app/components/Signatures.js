// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Input from '../containers/Input'

type Props = {};

export default class Signatures extends Component<Props> {
  props: Props;

  render() {
    const {
      handleSignaturesRequiredChange,
      signaturesRequired,
      signaturesRequiredError,
      handleSignaturesChange,
      signatures,
      signaturesError,
      next
    } = this.props

    return (
      <div>
        <Input 
          label="Enter the number of signatures required" 
          type="text" 
          name="signatures" 
          error={signaturesRequiredError}
          value={signaturesRequired} 
          onChange={handleSignaturesRequiredChange} 
        />
        <Input 
          label="Enter the total number of signatures" 
          type="text" 
          name="total-signatures" 
          error={signaturesError}
          value={signatures} 
          onChange={handleSignaturesChange} 
          onReturn={next}
        />
        <ActionButtons>
          <Button onClick={this.props.back}>Back</Button>
          <Button onClick={next}>Next</Button>
        </ActionButtons>
      </div>
    );
  }
}
