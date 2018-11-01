// @flow
import React from "react";
import StyledPageWrapper from "../components/PageWrapper";

const PageWrapper = ({ title, children, icon, ...rest }) => {
  return (
    <StyledPageWrapper {...rest}>
      {icon && <StyledPageWrapper.Icon src={icon} />}
      <StyledPageWrapper.Title>{title}</StyledPageWrapper.Title>
      {children}
    </StyledPageWrapper>
  );
};

export default PageWrapper;
