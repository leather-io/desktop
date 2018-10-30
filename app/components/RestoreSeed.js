// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Input from '../containers/Input'

type Props = {};

export default class RestoreSeed extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)
  }

  render() {

    const { 
      address,
      error,
      handleChange,
      next
    } = this.props

    return (
      <div>
        <div>
          <p>
            For your security, at this time you can only create a watch-only wallet if you do not have a hardware wallet device.
          </p>
          <p>
            Enter your Stacks address or public key to continue.
          </p>
          <Input 
            type="textarea" 
            name="address" 
            value={address} 
            error={error} 
            onChange={handleChange} 
          />        
          <ActionButtons>
            <Button to="/">Back</Button>
            <Button onClick={next}>Restore</Button>
          </ActionButtons>
        </div>
      </div>
    );
  }
}
