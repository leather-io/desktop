// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

type Props = {};

export default class DefaultView extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <button className={styles.btn} onClick={this.props.generateNewSeed}>
          Generate New Seed
        </button>
        <br/><Link to="/">Back</Link><br/>
      </div>
    );
  }
}
