// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Stacks Wallet</h2>
          <Link to="/onboarding">New Wallet</Link><br/>
          <Link to="/onboarding">Use hardware wallet</Link>
        </div>
      </div>
    );
  }
}
