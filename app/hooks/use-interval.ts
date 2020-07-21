import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const savedCallback = useRef(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
