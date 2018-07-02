// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

type Props = {};

export default class HardwareView extends Component<Props> {
  props: Props;

  render() {
    const {
      name
    } = this.props

    return (
      <div>
        Name:
        <input type="text" name="name" value={name} onChange={this.props.handleNameChange} />
        <button className={styles.btn} onClick={this.props.getTrezorAddress}>
          Get address from Trezor
        </button>
        <button className={styles.btn} onClick={this.props.getLedgerAddress}>
          Get address from Ledger
        </button>
        <br/><Link to="/">Back</Link><br/>
      </div>
    );
  }
}
