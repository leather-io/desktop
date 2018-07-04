// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import StyledInput from '../components/Input';

const renderInput = (type, name, value, onChange) => {
	if (type === 'textarea') {
		return <StyledInput.TextArea name={name} value={value} onChange={onChange} />
	} else {
		return <StyledInput.TextBox type="text" name={name} value={value} onChange={onChange} />
	}
}

const Input = ({
  label,
  type,
  name,
  value,
  smallText,
  onChange
}) => {
  return (
    <StyledInput>
      <StyledInput.Label>{label}</StyledInput.Label>
      {renderInput(type, name, value, onChange)}
      <StyledInput.SmallText>{smallText}</StyledInput.SmallText>
    </StyledInput>
  )
}

export default Input
