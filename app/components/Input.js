import styled, { css } from 'styled-components'

const StyledInput = styled.div`
  padding: 5px;
  display: flex;
 	flex-direction: column;
`

const Label = styled.span`
  font-size: 20px;
  text-align: left;
  margin-bottom: 15px;
`

const TextBox = styled.input`
	color: #fff;
	height: 28px;
	font-size: 18px;
	background-color: rgba(255, 255, 255, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.35);
	padding: 3px 10px;
`
const TextArea = styled.textarea`
	color: #fff;
  ${({ height }) =>
    height ? 
    css`
      height: ${height}px;
    ` : 
    css`
    	height: 88px;
    `
  };
	font-size: 18px;
	background-color: rgba(255, 255, 255, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.35);
	padding: 8px 10px;
`

const SmallText = styled.p`
	font-size: 14px;
`

const ErrorText = styled.p`
	font-size: 14px;
	color: #e52f2a;
`

StyledInput.Label = Label
StyledInput.TextBox = TextBox
StyledInput.TextArea = TextArea
StyledInput.SmallText = SmallText
StyledInput.ErrorText = ErrorText

export default StyledInput