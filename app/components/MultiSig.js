// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

type Props = {};

export default class MultiSigView extends Component<Props> {
  props: Props;

  render() {
    const {
      name,
      handlePubKeyChange,
      handleSignaturesRequiredChange,
      signaturesRequired,
      addPublicKey,
      publicKeys,
      next
    } = this.props

    return (
      <div>
        Name:
        <input type="text" name="name" value={name} onChange={this.props.handleNameChange} />
        Signatures Required:
        <input type="text" name="signatures" value={signaturesRequired} onChange={this.props.handleSignaturesRequiredChange} />
        Public Keys:
        {publicKeys.map((key, index) => 
          <textarea key={index} value={publicKeys[index]} onChange={(e) => handlePubKeyChange(e, index)}>
          </textarea>
        )}
        <button className={styles.btn} onClick={addPublicKey}>
          Add Public Key
        </button>
        <button className={styles.btn} onClick={next}>
          Next
        </button>
        <br/><Link to="/">Back</Link><br/>
      </div>
    );
  }
}
