import styled, { css } from 'styled-components'

const StyledPageWrapper = styled.div`
  ${({ center }) =>
  center && 
  css`
    text-align: center;
  `};
  
  ${({ topPadding }) =>
  topPadding ? 
  css`
  	padding: ${topPadding}px 30px 30px 30px;
  ` : 
	css`
		padding: 30px;
	`};
`

const Title = styled.h2`
  font-size: 35px;
  text-align: center;
  margin-bottom: 35px;
`

const Icon = styled.img`
  position: relative;
  margin-bottom 30px;
  width: 45px;
  height: 45px;
`

StyledPageWrapper.Title = Title
StyledPageWrapper.Icon = Icon

export default StyledPageWrapper