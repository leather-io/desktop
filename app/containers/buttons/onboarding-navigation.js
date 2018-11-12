import React from "react";
import { Type, Buttons, Flex } from "blockstack-ui/dist";
import { Button } from "@components/button/index";
import { Link } from "react-router-dom";
import { Hover } from "react-powerplug";

const NextButton = ({ label, ...props }) => (
  <Button invert {...props}>
    {label}
  </Button>
);

const Back = ({ ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Type
        pt={3}
        cursor={hovered ? "pointer" : undefined}
        color={hovered ? "hsl(242, 56%, 85%)" : "hsl(242, 56%, 75%)"}
        {...bind}
      >
        Back
      </Type>
    )}
  </Hover>
);

const BackButton = ({ to, onClick, ...props }) =>
  to ? (
    <Link to={to}>
      <Back />
    </Link>
  ) : (
    <Flex onClick={onClick}>
      <Back />
    </Flex>
  );

const OnboardingNavigation = ({ back, next, nextLabel = "Continue" }) => {
  return back || next ? (
    <Buttons
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      pt={6}
    >
      {next ? (
        typeof next === "function" ? (
          <NextButton label={nextLabel} onClick={next} />
        ) : (
          <NextButton label={nextLabel} to={next} />
        )
      ) : null}
      {back ? (
        typeof back === "function" ? (
          <BackButton onClick={back} />
        ) : (
          <BackButton to={back} />
        )
      ) : null}
    </Buttons>
  ) : null;
};

export { OnboardingNavigation };
