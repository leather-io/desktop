import { API_URL } from "@common/constants";

const fetchJSON = async path => {
  try {
    const res = await fetch(path);
    return res.json();
  } catch (e) {
    throw e.message;
  }
};

const fetchStxAddressDetails = async address =>
  fetchJSON(`${API_URL}/api/stacks/addresses/${address}`);

export { fetchJSON, fetchStxAddressDetails };
