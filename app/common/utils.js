import { IS_BROWSER } from "@common/constants";

const fallback = func => {
  setTimeout(func, 0);
};

const raf =
  IS_BROWSER && self.requestAnimationFrame
    ? self.requestAnimationFrame
    : fallback;

const ric =
  IS_BROWSER && self.requestIdleCallback ? self.requestIdleCallback : fallback;

export { raf, ric };
