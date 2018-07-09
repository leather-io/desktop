import styled, { css } from 'styled-components'

const Blob = styled.div`
  text-align: left;
  max-width: 100%;
  overflow-wrap: break-word;
  margin: 20px 0px;
  padding:12px;
  background-color: rgba(255,255,255,0.1);
  max-height: 180px;
  overflow-y: auto;

  ${({ fontSize }) =>
  fontSize ? 
  css`
  	font-size: ${fontSize}px;
  ` : 
	css`
		font-size: 12px;
	`};
`

export default Blob