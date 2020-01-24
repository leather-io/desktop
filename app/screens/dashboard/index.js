import React from "react";
import { Flex, Type, Card } from "blockstack-ui/dist";
import SettingsIcon from "mdi-react/SettingsIcon";
import { Hover } from "react-powerplug";
import { TxList } from "@components/transaction-list";
import { OpenModal } from "@components/modal";
import { TableHeader } from "@components/table";
import { SettingsModal } from "@containers/modals/settings";
import { Balance } from "@containers/balance";
import { connect } from "react-redux";
import {
  selectWalletLoading,
  selectWalletData,
  selectPendingTxs,
  selectWalletIsFetching
} from "@stores/selectors/wallet";
import { ReceiveButton } from "@containers/balance";
import { ButtonCombo } from "@containers/buttons/onboarding-navigation";
import { doRefreshData, doCompatibilityCheck } from "@stores/actions/wallet";
import debounce from "lodash.debounce";
import { Spinner } from "@components/spinner";

const Content = ({ ...rest }) => (
  <Flex flexDirection="column" flexShrink={0} flexGrow={1} {...rest} />
);

const SettingsButton = ({ ...rest }) => {
  return (
    <OpenModal component={({ visible, hide }) => <SettingsModal hide={hide} />}>
      {({ bind }) => (
        <Hover>
          {({ hovered, bind: hoveredBind }) => (
            <Flex
              position="relative"
              zIndex={999}
              p={2}
              opacity={hovered ? 1 : 0.5}
              cursor={hovered ? "pointer" : undefined}
              {...bind}
              {...hoveredBind}
            >
              <SettingsIcon />
            </Flex>
          )}
        </Hover>
      )}
    </OpenModal>
  );
};

const Header = ({ ...rest }) => {
  return (
    <Flex justifyContent="space-between">
      <Flex />
      <SettingsButton />
    </Flex>
  );
};
const tableHeadItems = [
  {
    label: "Date",
    width: 52
  },
  {
    label: "Details",
    width: 60,
    flexGrow: 1
  },
  {
    label: "Amount",
    mr: 4
  }
];

const NewWallet = ({ doRefreshData, fetching, ...rest }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    flexGrow={1}
  >
    <Card
      pt={8}
      px={7}
      pb={6}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Type pb={5} fontSize={5}>
        Welcome to the Stacks Wallet
      </Type>
      <Type pb={2}>
        You don't have any balance or any associated transactions.
      </Type>
      <Type pb={5}>Click receive to view your STX address and QR code.</Type>
      <ButtonCombo
        pt={2}
        primary={{
          component: <ReceiveButton />
        }}
        secondary={{
          label: fetching ? (
            <Spinner stroke={4} size={18} color="currentColor" />
          ) : (
            "Refresh"
          ),
          color: "blue",
          onClick: debounce(doRefreshData, 500)
        }}
      />
    </Card>
  </Flex>
);
const Dashboard = ({
  loading,
  data,
  style,
  doRefreshData,
  fetching,
  ...rest
}) => (
  <Flex style={style} bg="blue.light" flexGrow={1} maxWidth={"100%"}>
    <Content p={3} maxWidth={"100%"}>
      <Header />
      {!loading && data && !data.transactions ? (
        <NewWallet fetching={fetching} doRefreshData={doRefreshData} />
      ) : (
        <>
          <Balance />
          <TxList
            title="Transaction history"
            contentHeader={<TableHeader items={tableHeadItems} />}
            action={{
              label: fetching ? (
                <Spinner stroke={4} size={20} color="currentColor" />
              ) : (
                "Refresh"
              ),
              onClick: fetching ? () => null : doRefreshData
            }}
          />
        </>
      )}
    </Content>
  </Flex>
);

const mapStateToProps = state => ({
  loading: selectWalletLoading(state),
  data: selectWalletData(state),
  pending: selectPendingTxs(state),
  fetching: selectWalletIsFetching(state)
});

export default connect(
  mapStateToProps,
  { doRefreshData }
)(Dashboard);
