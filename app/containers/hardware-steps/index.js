import React from "react";
import { State } from "react-powerplug";
import { Flex } from "blockstack-ui/dist";
import { PageContext } from "@components/page";

const getDotColor = (bg, current) => {
  if (current) return "blue.accent";

  if (bg === "blue.dark") {
    return "blue.mid";
  } else {
    return "blue.light";
  }
};

const Dots = ({ items, current, ...rest }) => (
  <PageContext.Consumer>
    {({ bg }) =>
      items.map((item, i) => (
        <Flex
          borderRadius={8}
          m={1}
          key={i}
          size={8}
          bg={getDotColor(bg, current === i)}
          opacity={current !== i && bg === "blue.dark" ? 0.5 : 1}
        />
      ))
    }
  </PageContext.Consumer>
);

const HardwareSteps = ({ steps, children, ...rest }) => (
  <State initial={{ step: 0 }}>
    {({ state, setState }) => {
      const { value, icon: Icon } = steps[state.step];
      const next = () =>
        state.step < steps.length
          ? setState(currentState => ({
              step: currentState.step + 1
            }))
          : null;

      const prev = () =>
        state.step > 0
          ? setState(currentState => ({
              step: currentState.step - 1
            }))
          : null;

      const lastView = () =>
        setState(currentState => ({
          step: steps.length - 1
        }));

      return (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mx={"auto"}
          textAlign="center"
          {...rest}
        >
          <Flex
            size={100}
            mb={5}
            borderRadius={100}
            bg={"white"}
            border={1}
            borderColor="blue.mid"
            color="blue.mid"
            alignItems="center"
            justifyContent="center"
          >
            <Icon size={60} />
          </Flex>
          <Flex maxWidth={250}>{value}</Flex>
          {steps.length > 1 ? (
            <Flex pt={5}>
              <Dots items={steps} current={state.step} />
            </Flex>
          ) : null}
          {children
            ? children({
                step: state.step,
                hasNext: steps.length - 1 > state.step,
                hasPrev: state.step > 0,
                lastView,
                next,
                prev
              })
            : null}
        </Flex>
      );
    }}
  </State>
);

export { HardwareSteps };
