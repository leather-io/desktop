import { validateStacksAddress } from "stacks-utils";

const validateStxAmount = amount => {
  if (amount.toString().includes(".")) {
    const amountArr = amount.toString().split(".");
    if (amountArr.length > 2) {
      return {
        valid: false,
        message: "There are too many periods!"
      };
    }
    if (amountArr[1].length > 6) {
      return {
        valid: false,
        message: "Stacks can only go to 6 decimal places."
      };
    }
  }
  return {
    valid: true,
    message: null
  };
};

export { validateStacksAddress, validateStxAmount };
