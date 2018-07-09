// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Input from '../containers/Input'
import Scroll from '../components/Scroll'
import StyledInput from '../components/Input'

type Props = {};

export default class PubKeysView extends Component<Props> {
  props: Props;

  render() {
    const {
      handlePubKeyChange,
      addPublicKey,
      publicKeys,
      publicKeyErrors,
      error,
      next
    } = this.props

    return (
      <div>
        {error && <StyledInput.ErrorText>{error}</StyledInput.ErrorText>}
        <Scroll>
          {publicKeys.map((key, index) => 
            <Input 
              key={index}
              label={"Public Key #"+(index+1)}
              type="text" 
              name={"publicKey"+index}
              value={publicKeys[index]} 
              error={publicKeyErrors[index]}
              onChange={(e) => handlePubKeyChange(e, index)} 
              onReturn={() => {}}
            />        
          )}
          <Button onClick={addPublicKey} small>
            Add a Public Key
          </Button>
        </Scroll>
        <ActionButtons>
          <Button onClick={this.props.back}>Back</Button>
          <Button onClick={next}>Next</Button>
        </ActionButtons>
      </div>
    );
  }
}
