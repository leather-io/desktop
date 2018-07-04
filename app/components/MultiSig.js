// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
        <button onClick={addPublicKey}>
          Add Public Key
        </button>
        <button onClick={next}>
          Next
        </button>
        <br/><Link to="/">Back</Link><br/>
      </div>
    );
  }
}
