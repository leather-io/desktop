import styled from "styled-components";
import { themeGet } from "styled-system";

const Scroll = styled.div`
  height: 490px;
  padding-bottom: 50px;
  overflow-y: auto;
  padding-right: 10px;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: ${props => themeGet(`colors.${props.scrollbar}`)(props)};
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => themeGet(`colors.${props.thumb}`)(props)};
    border-radius: 8px;
  }
  & > * {
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      border-radius: 8px;
      background: ${props => themeGet(`colors.${props.scrollbar}`)(props)};
    }
    &::-webkit-scrollbar-thumb {
      background: ${props => themeGet(`colors.${props.thumb}`)(props)};
      border-radius: 8px;
    }
  }
`;
Scroll.defaultProps = {
  scrollbar: "blue.darker",
  thumb: "blue.light"
};

export default Scroll;
