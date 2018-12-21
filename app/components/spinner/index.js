import React from "react";
import styled from "styled-components";
import { theme } from "blockstack-ui/dist";

const Spinner = ({
  size = 50,
  color = theme.colors.blue.accent,
  stroke = 2
}) => (
  <StyledSpinner color={color} size={size} viewBox="0 0 50 50">
    <circle
      className="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      strokeWidth={stroke}
    />
  </StyledSpinner>
);

const StyledSpinner = styled.svg`
  animation: rotate 2s linear infinite;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: block;
  will-change: transform;

  & .path {
    stroke: ${({ color }) => color};
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

export { Spinner };
