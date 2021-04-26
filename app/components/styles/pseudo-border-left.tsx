import { ColorsStringLiteral, color } from '@stacks/ui';

export function pseudoBorderLeft(themeColor: ColorsStringLiteral) {
  return {
    position: 'relative',
    _before: {
      content: '""',
      top: 0,
      left: 0,
      borderRadius: '8px',
      width: '4px',
      height: '100%',
      position: 'absolute',
      background: color(themeColor),
    },
  } as const;
}
