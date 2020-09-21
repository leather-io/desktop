import React from "react";
import { Flex, Type, Box } from "blockstack-ui/dist";
import styled from "styled-components";

const SeedInput = styled.input`
  background: transparent;
  border: none;
  color: ${props => props.color};
  height: 28px;
  width: ${props => (props.small ? "75px;" : "100px;")}

  &:focus {
    outline: none;
  }
`;

const SeedWord = ({
  word,
  index,
  isInput,
  value,
  handleKeyPress,
  handleChange,
  focused,
  invert,
  handleOnPaste,
  small
}) => (
  <Flex
    border={1}
    borderColor={invert ? "#C4D7E5" : "#6E6CB4"}
    m={2}
    mt={1}
    width={small ? 120 : 180}
    height={small ? 35 : 50}
    flexDirection="row"
    flexGrow={1}
    textAlign="center"
    borderRadius="5px"
    bg={invert ? "#FFFFFF" : "#181664"}
    color={invert ? "#82a0b7" : "#FFFFFF"}
  >
    <Box
      borderRight={1}
      borderColor={invert ? "#C4D7E5" : "#6E6CB4"}
      py={small ? "5px" : "12px"}
      width="30%"
      fontSize="14px"
    >
      {index + 1}
    </Box>
    {isInput ? (
      <Box
        py={small ? "3px" : "10px"}
        px={small ? "8px" : "15px"}
        width="70%"
        fontSize={small ? "14px" : "16px"}
      >
        <SeedInput
          value={value}
          onKeyDown={event => handleKeyPress(event, index)}
          onChange={(event, sender) => handleChange(event, index, sender)}
          autoFocus={focused}
          color={invert ? "#82a0b7" : "#FFFFFF"}
          small={small}
          onPaste={
            handleOnPaste ? event => handleOnPaste(event, index) : undefined
          }
        />
      </Box>
    ) : (
      <Box
        py={small ? "5px" : "10px"}
        px={small ? "8px" : "15px"}
        width="70%"
        fontSize={small ? "14px" : "16px"}
      >
        {word}
      </Box>
    )}
  </Flex>
);

const seedArray = seedPhrase => {
  if (seedPhrase && seedPhrase.length > 0) {
    return seedPhrase.split(" ");
  } else {
    return [];
  }
};

const Seed = ({
  seedPhrase,
  isInput,
  numWords,
  values,
  handleKeyPress,
  handleChange,
  invert,
  small,
  handleOnPaste,
  ...rest
}) => {
  const seedWords = seedPhrase
    ? seedArray(seedPhrase)
    : Array(numWords).fill("");
  return (
    <Flex
      mt={3}
      mb={4}
      p={1}
      alignItems="center"
      color="white"
      maxWidth="600px"
      position="relative"
      flexWrap="wrap"
      {...rest}
    >
      {seedWords.map((word, i) => (
        <SeedWord
          handleOnPaste={handleOnPaste}
          word={word}
          index={i}
          key={i}
          value={values ? values[i] : ""}
          handleKeyPress={handleKeyPress}
          handleChange={handleChange}
          isInput={isInput}
          focused={i === 0 ? true : false}
          invert={invert}
          small={small}
        />
      ))}
    </Flex>
  );
};

export { Seed };
