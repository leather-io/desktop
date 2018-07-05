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
      error,
      next
    } = this.props

    return (
      <div>
        <Input 
          label="Number of signatures required" 
          type="text" 
          name="signatures" 
          error={error}
          value={signaturesRequired} 
          onChange={handleSignaturesRequiredChange} 
        />
        <ActionButtons>
          <Button onClick={this.props.back}>Back</Button>
          <Button onClick={next}>Next</Button>
        </ActionButtons>
      </div>
    );
  }
}
