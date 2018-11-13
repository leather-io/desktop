import React from "react";
import { Flex, Type, Button, Buttons } from "blockstack-ui/dist";
import { formatLargeNumber } from "@utils";
const Value = ({ micro, amount, suffix, ...rest }) => {
  const adjustedValue = micro ? parseInt(amount) / 1000000 : amount;
  const hasMicroStacks = adjustedValue.toString().includes(".");
  const value = hasMicroStacks ? adjustedValue.toString().split(".") : [amount];
  const wholeUnits = formatLargeNumber(value[0]);
  const fractionalUnits = hasMicroStacks ? `.${value[1]}` : null;
  return (
    <Type fontSize={8} fontWeight={300} {...rest}>
      {wholeUnits}
      {fractionalUnits && (
        <Type color="hsl(205, 30%, 70%)">{fractionalUnits}</Type>
      )}
      {suffix ? <Type pl={1} color="hsl(205, 30%, 70%)">{suffix}</Type> : null}
    </Type>
  );
};

export { Value };
