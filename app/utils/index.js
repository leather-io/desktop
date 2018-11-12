import numeral from "numeral";

const formatLargeNumber = val => numeral(val).format("0,0");
const formatStx = val => numeral(val).format("0,0[.]000000");

export { formatStx, formatLargeNumber };
