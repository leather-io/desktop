// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Blob from '../components/Blob'
import { CopyToClipboard } from 'react-copy-to-clipboard';

type Props = {};

export default class SendError extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)
  }

  render() {

    const { 
      error,
      back
    } = this.props

    return (
      <div>
        <div>
          <p>Error</p>
        </div>
        {error}
        <br/><br/>

        <ActionButtons>
          <Button to="/send">Back</Button>
        </ActionButtons>

      </div>
    );
  }
}
