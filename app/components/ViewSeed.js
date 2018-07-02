// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

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
            Write down your seed:
          </p>
          <span className={styles.seed}>
            {seed}
          </span>
          <br/>
          <button 
            className={styles.btn} 
            onClick={this.props.next}>
            I wrote it down
          </button>
          <button 
            className={styles.btn} 
            onClick={this.props.back}>
            Back
          </button>
          </div>
        }
      </div>
    );
  }
}
