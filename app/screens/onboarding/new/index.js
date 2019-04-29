import React from "react";
import { Box, Flex, Buttons, Type, Input } from "blockstack-ui/dist";
import { Button } from "@components/button/index";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { OpenModal } from "@components/modal";
import { SoftwareWarningModal as WarningModal } from "@containers/modals/software-warning";
import { Link } from "react-router-dom";
import { Redirect } from 'react-router'
import { ROUTES } from "@common/constants";

const Title = ({ ...rest }) => (
  <Type
    display="block"
    fontSize={7}
    fontWeight="300"
    fontFamily="brand"
    lineHeight={1.3}
    {...rest}
  />
);

const proceed = (hide, history) => {
  hide()
  history.push(ROUTES.NEW_SEED)
}

const NewScreen = ({ ...props }) => (
  <Flex
    flexGrow={1}
    flexDirection="column"
    bg="blue.dark"
    color="white"
    justifyContent="center"
    alignItems="center"
    textAlign="center"
    {...props}
  >
    <Box maxWidth="400px">
      <Title>Do you have a Hardware Wallet?</Title>
    </Box>
    <Type
      pb={2}
      Type
      lineHeight={1.5}
      fontSize={2}
      pt={4}
      color="hsl(242, 56%, 75%)"
      maxWidth="300px"
    >
    </Type>
    <Buttons maxWidth="420px" mx="auto" flexDirection="column" pt={5}>
      <Button outline is={Link} invert to={ROUTES.RESTORE_HARDWARE}>
        Yes
      </Button>
      <OpenModal component={({ visible, hide }) => 
        <WarningModal hide={hide} proceed={(hide) => proceed(hide, props.history)} />
        }>
        {({ bind }) => (
          <Button outline mt={4} invert {...bind}>
            No
          </Button>
        )}
      </OpenModal>

      <OnboardingNavigation
            onDark
            back={ROUTES.SETUP}
          />
    </Buttons>
  </Flex>
);

export default NewScreen;
