import styled from 'styled-components';
import { Flex } from '@blockstack/ui';

export function listHoverProps(hovered: boolean) {
  return hovered
    ? ({
        background: '#FAFAFC',
        borderRadius: '8px',
        zIndex: -1,
        position: 'absolute',
        display: 'block',
        width: 'calc(100% + 20px)',
        height: 'calc(100% + 16px)',
        left: '-8px',
        top: '-8px',
      } as const)
    : {};
}

// Component is required owing to glitch with ui lib
// where content style isn't applied to _before prop
export const EnableBefore = styled(Flex)`
  &::before {
    content: '';
  }
`;
