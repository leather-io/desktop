import React from "react";
import { Flex, Type } from "blockstack-ui/dist";
import { Hover, State } from "react-powerplug";

const Tab = ({ active, key, children, ...rest }) => (
  <Hover key={key}>
    {({ hovered, bind }) => (
      <Flex
        p={3}
        style={{
          userSelect: "none",
          cursor: !active && hovered ? "pointer" : undefined
        }}
        {...bind}
        {...rest}
      >
        <Type color={active || hovered ? "blue.dark" : "blue.mid"}>
          {children}
        </Type>
      </Flex>
    )}
  </Hover>
);

const TabsHeader = ({
  tabs,
  tabProps: { active: activeFn, handleClick },
  ...props
}) => (
  <Flex
    width={1}
    style={{
      flexGrow: 0,
      flexShrink: 0
    }}
    borderBottom="1px solid"
    borderColor={"blue.mid"}
    {...props}
  >
    {tabs.map(({ label, slug }) => {
      const active = activeFn(slug);
      return (
        <Tab key={slug} active={active} onClick={() => handleClick(slug)}>
          {label}
        </Tab>
      );
    })}
  </Flex>
);

const Tabs = ({
  initial,
  tabs: items,
  initialTab = items[0].slug,
  children,
  ...props
}) => (
  <State initial={{ current: initialTab }}>
    {({ state: { current }, setState }) => {
      const handleClick = tab => tab !== current && setState({ current: tab });
      const active = tab => tab === current;
      const tabProps = {
        active,
        handleClick
      };
      return (
        <Flex
          flexDirection="column"
          width={1}
          style={{ flexGrow: 1 }}
          {...props}
        >
          <TabsHeader tabs={items} tabProps={tabProps} />
          {children && children({ current, setState })}
        </Flex>
      );
    }}
  </State>
);

export { Tabs };
