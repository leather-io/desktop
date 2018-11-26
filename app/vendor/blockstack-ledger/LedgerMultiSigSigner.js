import { config as bskConfig } from "blockstack";
import btc from "bitcoinjs-lib";
import AppBtc from "ablankstein-ledger-hw-app-btc";
import ReadWriteLock from "rwlock";

import { getTransaction, serializeOutputHex } from "./utils";
import { LedgerSigner } from "./LedgerSigner";

class MockKeyPair {
  constructor(signature: Buffer, publicKey: Buffer) {
    this.signature = signature;
    this.publicKey = publicKey;
  }

  sign() {
    return this.signature;
  }
}

export class LedgerMultiSigSigner {
  constructor(
    hdPath: string,
    redeemScript: string,
    transportInterface: object
  ) {
    this.transportInterface = transportInterface;
    this.hdPath = hdPath;
    this.redeemScript = Buffer.from(redeemScript, "hex");
    this.publicKey = undefined;
    this.lock = new ReadWriteLock();
    this.transportObtained = null;
  }

  obtainAppInterface() {
    return new Promise(resolve => {
      this.lock.writeLock(release => {
        return this.transportInterface.create().then(transport => {
          this.transportObtained = { transport, release };
          resolve(new AppBtc(transport));
        });
      });
    });
  }

  closeInterface() {
    if (!this.transportObtained) {
      throw new Error("Tried to close unopened interface");
    }
    this.transportObtained.transport.close();
    this.transportObtained.release();
  }

  getPublicKey(): Promise<Buffer> {
    if (this.publicKey) {
      return Promise.resolve(this.publicKey);
    } else {
      return this.obtainAppInterface()
        .then(appInterface =>
          LedgerSigner.getPublicKeys(appInterface, [this.hdPath])
        )
        .then(x => {
          this.closeInterface();
          return x;
        })
        .then(pubkeys => Buffer.from(pubkeys[0], "hex"))
        .then(pkBuffer => {
          this.publicKey = pkBuffer;
          return pkBuffer;
        })
        .catch(err => {
          this.closeInterface();
          throw err;
        });
    }
  }

  getAddress() {
    const p2ms = btc.payments.p2ms({ output: this.redeemScript });
    const p2sh = btc.payments.p2sh({ redeem: p2ms });
    return Promise.resolve(bskConfig.network.coerceAddress(p2sh.address));
  }

  prepareInputs(tx, signInputIndex, appBtc) {
    const inputScripts = tx.ins.map((input, index) => {
      if (index !== signInputIndex) {
        return input.script.toString("hex");
      } else {
        return null;
      }
    });

    const inputsPromises = tx.ins.map((input, index) => {
      const txId = Buffer.from(input.hash)
        .reverse()
        .toString("hex");
      const outputN = input.index;
      const redeemScript =
        index === signInputIndex
          ? this.redeemScript.toString("hex")
          : undefined;
      return getTransaction(txId)
        .then(transaction => {
          const hasWitness = btc.Transaction.fromHex(
            transaction
          ).hasWitnesses();
          return appBtc.splitTransaction(transaction, hasWitness);
        })
        .then(preparedTx => [
          preparedTx,
          outputN,
          redeemScript,
          input.sequence
        ]);
    });

    return Promise.all(inputsPromises).then(inputs => ({
      inputs,
      inputScripts
    }));
  }

  prepareTransactionInfo(tx, signInputIndex, appBtc) {
    const sigHashType = 1; // SIGHASH_ALL
    const signPaths = tx.ins.map((input, index) => {
      if (index === signInputIndex) {
        return this.hdPath;
      } else {
        return null;
      }
    });
    const outputHex = serializeOutputHex(tx);
    const lockTime = tx.locktime;
    return this.prepareInputs(tx, signInputIndex, appBtc).then(result => {
      const { inputs, inputScripts } = result;
      return {
        inputs,
        inputScripts,
        signPaths,
        outputHex,
        lockTime,
        sigHashType
      };
    });
  }

  signTransaction(txB, signInputIndex) {
    return this.signTransactionSkeleton(txB.__tx, signInputIndex).then(
      signaturesHex => {
        if (signaturesHex.length !== 1) {
          throw new Error(
            `Unexpected number of signatures (${signaturesHex.length} > 1)`
          );
        }
        return this.getPublicKey().then(publicKey => {
          // god of abstraction, forgive me, for I have transgressed
          // add an '01' to convince btcjs to decompile our DER signature
          const sigBuffer = Buffer.from(signaturesHex[0] + "01", "hex");
          const decompiled = btc.script.signature.decode(sigBuffer);
          const signer = new MockKeyPair(decompiled.signature, publicKey);
          console.log(decompiled.signature.toString("hex"));
          txB.sign(signInputIndex, signer, this.redeemScript);
        });
      }
    );
  }

  signTransactionSkeleton(tx, signInputIndex) {
    return this.obtainAppInterface()
      .then(appBtc =>
        this.prepareTransactionInfo(tx, signInputIndex, appBtc).then(txInfo => {
          return appBtc.signP2SHTransaction(
            txInfo.inputs,
            txInfo.signPaths,
            txInfo.outputHex,
            txInfo.lockTime,
            txInfo.sigHashType,
            false,
            1
          );
        })
      )
      .then(x => {
        this.closeInterface();
        return x;
      })
      .catch(err => {
        this.closeInterface();
        console.log(err);
        console.log(err.stack);
        console.log(err.message);
        console.log(err.statusCode);
        console.log(err.statusText);
      });
  }
}
