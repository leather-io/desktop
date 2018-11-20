import { config } from "blockstack";
import { UTXO_SERVICE_URI } from "@common/constants";
import bigi from "bigi";

/**
 * Fetch Stacks balance from blockstack config api
 * @param {string} address - the STX address
 */
const fetchStxBalance = async address => {
  const balance = await config.network.getAccountBalance(address, "STACKS");
  return balance.toString();
};

/**
 * Fetch BTC balance from bitcoin core
 * @param {string} address - the BTC address
 */
const fetchBtcBalance = async address => {
  const BTC_BALANCE_CONFIRMED_URI = `${UTXO_SERVICE_URI}/insight-api/addr/${address}/balance`;
  const BTC_BALANCE_UNCONFIRMED_URI = `${UTXO_SERVICE_URI}/insight-api/addr/${address}/unconfirmedBalance`;

  const res1 = await fetch(BTC_BALANCE_CONFIRMED_URI);
  const res2 = await fetch(BTC_BALANCE_UNCONFIRMED_URI);

  const confirmed = await res1.text();
  const unconfirmed = await res2.text();

  console.log(confirmed, unconfirmed)

  return bigi
    .valueOf(parseInt(confirmed, 10) + parseInt(unconfirmed, 10))
    .toString();
};

export { fetchStxBalance, fetchBtcBalance };
