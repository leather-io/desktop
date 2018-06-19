// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import * as WalletActions from '../actions/wallet'

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

class Home extends Component<Props> {
  props: Props;

  render() {
    const {
      generateNewSeed
    } = this.props;

    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Stacks Wallet</h2>
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
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);