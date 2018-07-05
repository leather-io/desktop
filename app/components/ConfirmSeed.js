// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Input from '../containers/Input'

type Props = {};

export default class ConfirmSeed extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      seedConfirm: ''
    }
  }

  handleChange = (event) => {
    this.setState({
      seedConfirm: event.target.value
    })
  }

  render() {

    const { 
      seed,
      error
    } = this.props

    const {
      seedConfirm
    } = this.state

    return (
      <div>
        <div>
          <p>
            Confirm that you have written down your seed by re-entering it below.
          </p>
          <Input 
            type="textarea" 
            name="name" 
            value={seedConfirm} 
            error={error} 
            onChange={this.handleChange} 
          />        
          <ActionButtons>
            <Button onClick={this.props.back}>Back</Button>
            <Button onClick={() => this.props.next(seedConfirm)}>Confirm</Button>
          </ActionButtons>
        </div>
      </div>
    );
  }
}
