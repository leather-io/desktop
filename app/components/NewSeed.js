// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Input from '../containers/Input'

type Props = {
  name: PropTypes.string,
  handleNameChange: PropTypes.func,
  generateNewSeed: PropTypes.func
};

export default class NewSeedView extends Component<Props> {
  props: Props;

  render() {

    const {
      name
    } = this.props

    return (
      <div>
        <Input 
          label="Your name or company name" 
          smallText="This information will be used for verification."
          type="text" name="name" 
          value={name} 
          onChange={this.props.handleNameChange} 
        />
        <ActionButtons>
          <Button to="/">Back</Button>
          <Button onClick={() => this.props.generateNewSeed(name)}>Next</Button>
        </ActionButtons>
      </div>
    );
  }
}
