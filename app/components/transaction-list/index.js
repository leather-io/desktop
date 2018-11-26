import React from "react";
import { Flex, Type, Card } from "blockstack-ui/dist";
import { Hover } from "react-powerplug";
import { TxItem } from "@components/transaction-item";
import { LayersOffOutlineIcon } from "mdi-react";
import { connect } from "react-redux";
import {
  selectWalletHistory,
  selectPendingTxs,
  selectWalletStacksAddress
} from "@stores/selectors/wallet";

const Empty = ({ ...rest }) => (
  <Flex
    flexGrow={1}
    alignItems="center"
    justifyContent={"center"}
    color="hsl(205, 30%, 70%)"
    flexDirection="column"
  >
    <LayersOffOutlineIcon size={80} />
    <Flex pt={3}>
      <Type fontSize={2} fontWeight={700}>
        No Transaction History
      </Type>
    </Flex>
  </Flex>
);

const Action = ({
  onClick,
  label,
  wrapper: Wrapper = ({ children }) => children
}) => (
  <Wrapper>
    <Hover>
      {({ hovered, bind }) => (
        <Type
          color={hovered ? "blue.dark" : "hsl(205, 30%, 70%)"}
          style={{
            cursor: "pointer"
          }}
          onClick={onClick}
          {...bind}
        >
          {label}
        </Type>
      )}
    </Hover>
  </Wrapper>
);

const TxList = connect(state => ({
  history: selectWalletHistory(state),
  pending: selectPendingTxs(state),
  stx: selectWalletStacksAddress(state)
}))(
  ({
    children,
    contentHeader,
    title,
    action,
    history,
    pending,
    stx,
    ...rest
  }) => {
    const data = [...pending, ...history];
    return (
      <Card p={0} bg="blue.light" flexGrow={1} flexShrink={0}>
        <Flex
          justifyContent={"space-between"}
          borderBottom="1px solid"
          borderColor={"blue.mid"}
          px={4}
          py={3}
          borderRadius="6px 6px 0 0"
          flexShrink={0}
          bg="white"
        >
          <Type fontWeight={500}>{title}</Type>
          {action ? <Action {...action} /> : null}
        </Flex>
        {data && data.length && contentHeader ? contentHeader : null}
        <Flex
          flexDirection="column"
          overflow="auto"
          flexGrow={1}
          position="relative"
        >
          <Flex
            flexDirection="column"
            overflow="auto"
            position="absolute"
            height="100%"
            left={0}
            width={"100%"}
          >
            {data && data.length ? (
              data.map((item, i) => (
                <TxItem
                  stx={stx}
                  length={history.length}
                  key={i}
                  last={history.length === i + 1}
                  item={item}
                />
              ))
            ) : (
              <Empty />
            )}
          </Flex>
        </Flex>
      </Card>
    );
  }
);

export { TxList };
