// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

type Props = {};

export default class CompleteView extends Component<Props> {
  props: Props;

  render() {

    const { 
      address,
      payload
    } = this.props

    return (
      <div>
        <div>
          <p>
            Complete
          </p>
          <p>
            Address: {address}<br/>
            Verification Code: {payload}
          </p>
        </div>
      </div>
    );
  }
}
