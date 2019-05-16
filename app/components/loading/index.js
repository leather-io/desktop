import React from "react";
import { Flex, Type, Input, Buttons } from "blockstack-ui/dist";
import { Spinner } from "@components/spinner";

const Loading = ({ message = "Fetching wallet details...", ...rest }) => (
  <Flex
    position="absolute"
    width="100%"
    height="100%"
    left={0}
    top={0}
    alignItems="center"
    justifyContent="center"
    zIndex={9999}
    flexDirection="column"
    {...rest}
  >
    <Spinner size={80} />
    <Flex pt={6}>
      <Type fontWeight={500} color="blue.mid" opacity={0.5}>
        {message}
      </Type>
    </Flex>
  </Flex>
);

export { Loading };
