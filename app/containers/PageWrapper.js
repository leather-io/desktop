// @flow
import React, { Component } from 'react';
import StyledPageWrapper from '../components/PageWrapper'

const PageWrapper = ({ title, children }) => {
  return (
    <StyledPageWrapper>
      <StyledPageWrapper.Title>{title}</StyledPageWrapper.Title>
      {children}
    </StyledPageWrapper>
  )
}

export default PageWrapper
