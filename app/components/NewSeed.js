// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
        Name:
        <input type="text" name="name" value={name} onChange={this.props.handleNameChange} />
        <button onClick={() => this.props.generateNewSeed(name)}>
          Generate New Seed
        </button>
        <br /><Link to="/">Back</Link><br />
      </div>
    );
  }
}
