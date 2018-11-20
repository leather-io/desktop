import btc from "bitcoinjs-lib";
import { config as bskConfig } from "blockstack";
import varuint from "varuint-bitcoin";
import "cross-fetch/polyfill";

const KNOWN_TX_MAP = {};

export function getMultiSigInfo(publicKeys, signersRequired) {
  const redeem = btc.payments.p2ms({ m: signersRequired, pubkeys: publicKeys });
  const script = btc.payments.p2sh({ redeem });
  const address = script.address;
  return {
    address: bskConfig.network.coerceAddress(address),
    redeemScript: redeem.output.toString("hex")
  };
}

export function getCoinName() {
  const network = bskConfig.network.layer1;
  if (network.pubKeyHash === 0) {
    return "bitcoin";
  } else if (network.pubKeyHash === 111) {
    return "testnet";
  }
  throw new Error("Unknown layer 1 network");
}

export function getTransaction(txId) {
  if (txId in KNOWN_TX_MAP) {
    return Promise.resolve(Buffer.from(KNOWN_TX_MAP[txId], "hex"));
  }
  if (getCoinName() === "testnet") {
    return getTransactionBitcoind(txId);
  }

  const apiUrl = `https://blockchain.info/rawtx/${txId}?format=hex`;
  return fetch(apiUrl)
    .then(x => {
      if (!x.ok) {
        throw new Error("failed to get raw TX");
      }
      return x.text();
    })
    .then(x => Buffer.from(x, "hex"));
}

// https://github.com/feross/buffer/blob/master/index.js#L1127
function verifuint(value, max) {
  if (typeof value !== "number")
    throw new Error("cannot write a non-number as a number");
  if (value < 0)
    throw new Error("specified a negative value for writing an unsigned value");
  if (value > max) throw new Error("RangeError: value out of range");
  if (Math.floor(value) !== value)
    throw new Error("value has a fractional component");
}

function writeUInt64LE(buffer, value, offset) {
  verifuint(value, 0x001fffffffffffff);
  buffer.writeInt32LE(value & -1, offset);
  buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4);
  return offset + 8;
}

function varSliceSize(someScript) {
  const length = someScript.length;
  return varuint.encodingLength(length) + length;
}

export function serializeOutputHex(tx) {
  /*
    Cribbed from bitcoinjs-lib.
  */
  const byteLength = tx.outs.reduce(
    (sum, output) => sum + 8 + varSliceSize(output.script),
    varuint.encodingLength(tx.outs.length)
  );
  const buffer = Buffer.alloc(byteLength, 0);

  let offset = 0;
  function writeSlice(slice) {
    offset += slice.copy(buffer, offset);
  }
  function writeUInt64(i) {
    offset = writeUInt64LE(buffer, i, offset);
  }
  function writeVarInt(i) {
    varuint.encode(i, buffer, offset);
    offset += varuint.encode.bytes;
  }
  function writeVarSlice(slice) {
    writeVarInt(slice.length);
    writeSlice(slice);
  }

  writeVarInt(tx.outs.length);
  tx.outs.forEach(function(txOut) {
    if (!txOut.valueBuffer) {
      writeUInt64(txOut.value);
    } else {
      writeSlice(txOut.valueBuffer);
    }
    writeVarSlice(txOut.script);
  });

  return buffer.toString("hex");
}

function getTransactionBitcoind(txId) {
  const bitcoindUrl = bskConfig.network.btc.bitcoindUrl;
  const bitcoindCredentials = bskConfig.network.btc.bitcoindCredentials;

  const jsonRPC = {
    jsonrpc: "1.0",
    method: "getrawtransaction",
    params: [txId]
  };

  const authString = Buffer.from(
    `${bitcoindCredentials.username}:${bitcoindCredentials.password}`
  ).toString("base64");
  const headers = { Authorization: `Basic ${authString}` };
  return fetch(bitcoindUrl, {
    method: "POST",
    body: JSON.stringify(jsonRPC),
    headers
  })
    .then(resp => resp.json())
    .then(json => Buffer.from(json.result, "hex"));
}
