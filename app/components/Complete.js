// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

type Props = {};

export default class CompleteView extends Component<Props> {
  props: Props;

  render() {

    const { 
      seed 
    } = this.props

    return (
      <div>
        <div>
          <p>
            Complete
          </p>
        </div>
      </div>
    );
  }
}
