// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Blob from '../components/Blob'
import Input from '../components/Input'
import Warning from '../components/Warning'

type Props = {};

export default class ViewSeedView extends Component<Props> {
  props: Props;

  render() {

    const { 
      seed 
    } = this.props

    return (
      <div>
        {seed && 
          <div>
            <p>
              Please write down your seed phrase on paper. You will only be able to view this once.&nbsp;
            </p>
            <p>
              Your seed phrase:
            </p>
            <Blob fontSize={16}>
              {seed}
            </Blob>
            <Input.SmallText>
              Your seed phrase gives you access to your Stacks. Make sure to keep this information in a safe place.
              For best practices on storing your seed phrase please refer to the <a href="https://www.blockstack.org" target='_blank'>Investor FAQ</a>.
            </Input.SmallText>
            <Warning>Warning: You will lose access to your Stacks if you do not write this down!</Warning>
            <ActionButtons>
              <Button onClick={this.props.back}>Back</Button>
              <Button onClick={this.props.next}>Next</Button>
            </ActionButtons>
          </div>
        }
      </div>
    );
  }
}
