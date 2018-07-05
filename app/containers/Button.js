// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import StyledButton from '../components/Button';

const Button = ({
  label,
  children,
  type,
  small,
  height = 44,
  to,
  ...rest
}) => {

  const ButtonComponent = props => {
    
    if (to) {
      return <StyledButton.Link {...props} />
    } else if (small) {
      return <StyledButton.Small {...props} />
    } else if (type) {
      return <StyledButton {...props} type={type} />
    } else {
      return <StyledButton.Div {...props} />
    }
  }

  return (
    <ButtonComponent {...rest} height={height} to={to}>
      { small ? 
        <StyledButton.SmallLabel>{children}</StyledButton.SmallLabel>  
        :
        <StyledButton.Label>{children}</StyledButton.Label>
      }
    </ButtonComponent>
  )

}

export default Button
