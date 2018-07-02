// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import Button from '../containers/Button'

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Stacks Wallet</h2>
          <div>
            <Button to="/new">New Wallet</Button>
            <Button to="/hardware">Use Hardware Wallet</Button>
            <Button to="/multisig">Use Multi-signature Wallet</Button>
          </div>
        </div>
      </div>
    );
  }
}
