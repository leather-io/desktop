// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Blob from '../components/Blob'

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
          <Blob>
            Address: {address}
          </Blob>
          <Blob>
            Verification Code: {payload}
          </Blob>
          <ActionButtons>
            <Button onClick={() => this.props.next()}>Finish</Button>
          </ActionButtons>
        </div>
      </div>
    );
  }
}
