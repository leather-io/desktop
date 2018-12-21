import { createGlobalStyle, css } from "styled-components";
import { theme } from "blockstack-ui";
import { normalize } from "polished";

// this is so it will auto format with prettier
const styles = css`
  ${normalize()}
  @import url("https://fonts.googleapis.com/css?family=IBM+Plex+Mono:300,400,500,600,700");
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
  html {
    height: 100%;
    width: 100%;
    max-width: 100%;
    font-variant-numeric: tabular-nums;
  }

  * {
    box-sizing: border-box;
  }

  body {
    position: relative;
    height: 100%;
    width: 100%;
    max-width: 100%;
    font-size: 16px;
    margin: 0;
    font-family: ${theme.fonts.default};
    color: ${theme.colors.blue.dark};
    line-height: 1.4rem;
    display: flex;
    flex-direction: column;
    background-color: ${theme.colors.blue.dark};
    #root {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      & > div {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
    }
  }

  textarea {
    resize: vertical;
  }
  #root {
    max-width: 100%;
  }

  h2 {
    margin: 0;
    font-size: 3rem;
    font-weight: normal;
    color: #ffffff;
  }

  p {
    font-size: 20px;
  }

  li {
    list-style: none;
  }

  a {
    color: #ffffff;
    text-decoration: underline;
  }

  a:hover {
    opacity: 1;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const GlobalStyles = createGlobalStyle`${styles}`;

export { GlobalStyles };
