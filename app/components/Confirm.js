// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

type Props = {};

export default class ConfirmView extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      seedConfirm: ''
    }
  }

  handleChange = (event) => {
    this.setState({
      seedConfirm: event.target.value
    })
  }

  render() {

    const { 
      seed,
      error
    } = this.props

    const {
      seedConfirm
    } = this.state

    return (
      <div>
        <div>
          <p>
            Confirm that you have written down your seed by re-entering it in the box below.
          </p>
          <textarea value={seedConfirm} onChange={this.handleChange}>
            
          </textarea>
          {error && <p>{error}</p>}
          <br/>
          <button 
            className={styles.btn} 
            onClick={() => this.props.next(seedConfirm)}>
            Confirm
          </button>
          <button 
            className={styles.btn} 
            onClick={this.props.back}>
            Back
          </button>
        </div>
      </div>
    );
  }
}
