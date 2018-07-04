// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import StyledActionButtons from '../components/StyledActionButtons';

const ActionButtons = ({
  buttons,
  children
}) => {
  return (
    <StyledActionButtons>
      {children}
    </StyledActionButtons>
  )
}

export default ActionButtons
