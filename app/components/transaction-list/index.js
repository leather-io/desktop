import React from "react";
import { Flex, Type, Card, Scrollbars } from "blockstack-ui/dist";

import { Hover } from "react-powerplug";
import { TxItem } from "@components/transaction-item";
import { LayersOffOutlineIcon, LoadingIcon } from "mdi-react";
import { connect } from "react-redux";
import { Spinner } from "@components/spinner";
import {
  selectWalletHistory,
  selectPendingTxs,
  selectWalletStacksAddress,
  selectRawTxs,
  selectWalletIsFetching
} from "@stores/selectors/wallet";

const Empty = ({ isFetching, ...rest }) => {
  const Icon = isFetching ? Spinner : LayersOffOutlineIcon;
  const message = isFetching ? "Loading..." : "No Transaction History";
  return (
    <Flex
      flexGrow={1}
      alignItems="center"
      justifyContent={"center"}
      color="hsl(205, 30%, 70%)"
      flexDirection="column"
    >
      <Icon
        color="currentColor"
        stroke={isFetching ? 3 : undefined}
        size={isFetching ? 50 : 80}
      />
      <Flex pt={3}>
        <Type fontSize={2} fontWeight={700}>
          {message}
        </Type>
      </Flex>
    </Flex>
  );
};

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
  txs: selectRawTxs(state),
  stx: selectWalletStacksAddress(state),
  isFetching: selectWalletIsFetching(state)
}))(
  ({
    children,
    contentHeader,
    title,
    action,
    history,
    txs,
    pending,
    stx,
    isFetching,
    ...rest
  }) => {
    const data = txs;
    return (
      <Card p={0} bg="blue.light" flexGrow={1} flexShrink={0}>
        <Flex
          justifyContent={"space-between"}
          borderBottom="1px solid"
          borderColor={"blue.mid"}
          px={4}
          py={3}
          borderRadius="8px 8px 0 0"
          flexShrink={0}
          bg="white"
        >
          <Type fontWeight={500}>{title}</Type>
          {data && data.length && action ? <Action {...action} /> : null}
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
                  length={data.length}
                  key={item.txid}
                  last={data.length - 1 === i}
                  item={item}
                />
              ))
            ) : (
              <Empty isFetching={isFetching} />
            )}
          </Flex>
        </Flex>
      </Card>
    );
  }
);

export { TxList };
