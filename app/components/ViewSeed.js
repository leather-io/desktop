// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'

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
              Write down your seed
            </p>
            <span>
              {seed}
            </span>
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
