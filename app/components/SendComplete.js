// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Blob from '../components/Blob'
import { CopyToClipboard } from 'react-copy-to-clipboard';

type Props = {};

export default class SendComplete extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)
  }

  render() {

    const { 
      txID,
      confirm
    } = this.props

    return (
      <div>
        <p>Transaction Sent!</p>
        <p>Transaction ID:</p>
        <Blob>{txID}</Blob>
        <br/><br/>
{/*        <Button to="/send" height={25} small>
          Check status
        </Button>*/}

        <ActionButtons>
          <Button to="/dashboard">Done</Button>
        </ActionButtons>

      </div>
    );
  }
}
