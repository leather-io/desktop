import React from "react";
import { Button as SysButton } from "blockstack-ui/dist";
import { Link } from "react-router-dom";

export const Button = ({ outline, invert, to, ...rest }) => (
  <SysButton
    is={to ? Link : undefined}
    height="auto"
    py={2}
    outline={outline}
    invert={invert}
    to={to}
    border="1px solid"
    {...rest}
  />
);
