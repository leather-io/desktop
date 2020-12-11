import React from 'react';
import { Box, color } from '@stacks/ui';

export const SentArrow = () => {
  return (
    <Box color={color('brand')} as="svg" width="12px" height="16px" fill="none" viewBox="0 0 12 16">
      <Box
        as="path"
        fill="currentColor"
        d="M5.997 13c.613 0 1.028-.428 1.028-1.058V4.557l-.068-1.472 1.28 1.478L9.79 6.11c.191.183.43.318.736.318.552 0 .974-.4.974-.983 0-.264-.109-.515-.32-.732L6.753.305A1.098 1.098 0 005.997 0c-.28 0-.566.115-.756.305L.82 4.713C.608 4.93.5 5.18.5 5.445c0 .583.422.983.974.983.306 0 .545-.135.729-.318l1.553-1.547 1.28-1.478-.061 1.472v7.385c0 .63.409 1.057 1.022 1.057z"
      />
      <Box as="path" fill="currentColor" d="M.5 15a1 1 0 001 1h9a1 1 0 100-2h-9a1 1 0 00-1 1z" />
    </Box>
  );
};
