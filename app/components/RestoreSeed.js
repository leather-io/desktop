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
      seed,
      error,
      handleChange,
      next,
      back
    } = this.props

    return (
      <div>
        <div>
          <p>
            Enter your seed phrase to restore your wallet.
          </p>
          <Input 
            type="textarea" 
            name="seed" 
            value={seed} 
            error={error} 
            onChange={handleChange} 
          />        
          <ActionButtons>
            <Button onClick={back}>Back</Button>
            <Button onClick={next}>Restore</Button>
          </ActionButtons>
        </div>
      </div>
    );
  }
}
