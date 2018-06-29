// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import * as WalletActions from '../actions/wallet'
import DefaultView from './Default'
import SeedView from './Seed'
import ConfirmView from './Confirm'
import CompleteView from './Complete'

type Props = {};

function mapStateToProps(state) {
  return {
    seed: state.wallet.seed,
    address: state.wallet.address,
    publicKey: state.wallet.publicKey
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

const VIEWS = {
  DEFAULT: 0,
  SEED: 1,
  CONFIRM: 2,
  COMPLETE: 3,
}

class Onboarding extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.DEFAULT,
      error: null
    }
  }

  changeView = (view) => {
    this.setState({
      view: view
    })
  }

  generateNewSeed = () => {
    this.props.generateNewSeed()
    this.changeView(VIEWS.SEED)
  }

  showConfirmView = () => {
    this.changeView(VIEWS.CONFIRM)
  }

  confirmSeed = (confirmSeed) => {
    if (confirmSeed === this.props.seed) {
      this.changeView(VIEWS.COMPLETE)
    } else {
      this.setState({
        error: 'The seed phrase you entered did not match!'
      })
    }
  }

  renderView(view) {
    switch(view) {
      case VIEWS.DEFAULT:
        return <DefaultView
                generateNewSeed={this.generateNewSeed}
               />;
      case VIEWS.SEED:
        return <SeedView
                seed={this.props.seed}
                next={this.showConfirmView}
                back={() => this.changeView(VIEWS.DEFAULT)}
               />;
      case VIEWS.CONFIRM:
        return <ConfirmView
                error={this.state.error}
                next={this.confirmSeed}
                back={() => this.changeView(VIEWS.SEED)}
               />;
      case VIEWS.COMPLETE:
        return <CompleteView />;
      default:
        return <DefaultView />;
    }
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>New Wallet</h2>
          {this.renderView(this.state.view)}

          {/*
          <button className={styles.btn} onClick={generateNewSeed} data-tclass="btn">
            Generate New Seed
          </button>
          {this.props.seed && 
            <div>
            <p>
              Write down your seed:
            </p>
            <span className={styles.seed}>
              {this.props.seed}
            </span>
            </div>
          }
          {this.props.address && 
            <div>
            <p>
              This is your Stacks address:
            </p>
            <span className={styles.address}>
              {this.props.address}
            </span>
            </div>
          }
          {this.props.publicKey && 
            <div>
            <p>
              This is your public key:
            </p>
            <span className={styles.publicKey}>
              {this.props.publicKey}
            </span>
            </div>
          }*/}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);