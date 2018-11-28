import btc from "bitcoinjs-lib";
import crypto from "crypto";
import { config as bskConfig } from "blockstack";
import { TrezorSigner } from "./TrezorSigner";
import { pathToPathArray } from "./utils";

export class TrezorMultiSigSigner extends TrezorSigner {
  constructor(hdpath, redeemScript: string, address: string) {
    super(hdpath, address);
    const redeemScriptBuffer = Buffer.from(redeemScript, "hex");
    this.p2ms = btc.payments.p2ms({ output: redeemScriptBuffer });
  }

  static createSigner(path, redeemScript) {
    const p2ms = btc.payments.p2ms({
      output: Buffer.from(redeemScript, "hex")
    });
    const script = btc.payments.p2sh({ redeem: p2ms });

    const address = bskConfig.network.coerceAddress(script.address);
    console.log(`SCRIPT ADDR: ${script.address}, ADDR: ${address}`);

    return Promise.resolve().then(
      () => new TrezorMultiSigSigner(path, redeemScript, address)
    );
  }

  prepareInputs(inputs, myIndex, multisig) {
    return inputs.map((input, inputIndex) => {
      const translated = TrezorSigner.translateInput(input);
      if (inputIndex === myIndex) {
        translated["address_n"] = pathToPathArray(this.hdpath);
        translated["multisig"] = multisig;
        translated["script_type"] = "SPENDMULTISIG";
      }
      return translated;
    });
  }

  signTransaction(txB, signInputIndex) {
    let signatures = [];
    const txBSigs = txB.__inputs[signInputIndex].signatures;
    if (txBSigs) {
      signatures = txBSigs.map(signature => {
        if (signature) {
          return signature.toString("hex").slice(0, -2);
        } else {
          return "";
        }
      });
    } else {
      signatures = this.p2ms.pubkeys.map(() => "");
    }

    const pubkeys = this.p2ms.pubkeys.map(
      // make fake xpubs?
      pubkey => {
        const chainCode = crypto.randomBytes(32);
        const hdNode = btc.bip32.fromPublicKey(pubkey, chainCode);
        hdNode.network = bskConfig.network.layer1;
        return { node: hdNode.toBase58() };
      }
    );

    const multisig = { pubkeys, m: this.p2ms.m, signatures };

    return this.signTransactionSkeleton(
      txB.__tx,
      signInputIndex,
      multisig
    ).then(resp => {
      const signedTxHex = resp.tx;
      // god of abstraction, forgive me, for I have transgressed
      const signedTx = btc.Transaction.fromHex(signedTxHex);
      const signedTxB = btc.TransactionBuilder.fromTransaction(signedTx);
      txB.__inputs[signInputIndex] = signedTxB.__inputs[signInputIndex];
    });
  }

  signerVersion() {
    return 1;
  }
}
