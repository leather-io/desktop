import React, { FC } from 'react';
import { Box } from '@stacks/ui';
import ReactCardFlip from 'react-card-flip';

interface WaffleChartProps {
  points: boolean[];
}

export const WaffleChart: FC<WaffleChartProps> = ({ points }) => {
  return (
    <>
      {points.map((active, key) => (
        <ReactCardFlip
          key={key}
          isFlipped={!active}
          flipSpeedBackToFront={1}
          flipSpeedFrontToBack={1}
        >
          <Box
            width="22px"
            height="22px"
            backgroundColor="blue.300"
            mr="3px"
            mb="3px"
            borderRadius="2px"
          />
          <Box
            width="22px"
            height="22px"
            backgroundColor="ink.150"
            mr="3px"
            mb="3px"
            borderRadius="2px"
          />
        </ReactCardFlip>
      ))}
    </>
  );
};
