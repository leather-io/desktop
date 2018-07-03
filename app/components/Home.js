// @flow
import React, { Component } from 'react';
import styled from 'styled-components'
import Button from '../containers/Button'

type Props = {};

const Wrapper = styled.div`
  text-align: center;
`

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <Wrapper>
        <div data-tid="container">
          <h2>Stacks Wallet</h2>
          <div>
            <Button to="/new">New Wallet</Button>
            <Button to="/hardware">Use Hardware Wallet</Button>
            <Button to="/multisig">Use Multi-signature Wallet</Button>
          </div>
        </div>
      </Wrapper>
    );
  }
}
