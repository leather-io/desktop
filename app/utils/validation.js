import { c32addressDecode } from "c32check";

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

const validateStxAddress = address => {
  let valid = false;
  try {
    if (c32addressDecode(address)) {
      console.log("Valid stacks address");
      valid = true;
    }
  } catch (e) {
    console.log("Not a valid STX address");
    valid = false;
  }
  return valid;
};

export { validateStxAddress, validateStxAmount };
