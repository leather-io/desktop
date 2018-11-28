import { API_URL } from "@common/constants";

/**
 * fetchJSON
 *
 * simple abstraction for json fetches.
 *
 * @param {String} path - the path/url to fetch
 */
const fetchJSON = async path => {
  try {
    const res = await fetch(path);
    return res.json();
  } catch (e) {
    throw e.message;
  }
};

/**
 * fetchStxAddressDetails
 *
 * Fetches data for a stacks address from the Blockstack Explorer API
 * Contains data about allocations and confirmed stx tx's
 *
 * @param {String} address - the Stacks address
 */
const fetchStxAddressDetails = async address =>
  fetchJSON(`${API_URL}/api/stacks/addresses/${address}`);

export { fetchJSON, fetchStxAddressDetails };
