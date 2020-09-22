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

const getSeedFromAnyString = string =>
  string
    .trim()
    .match(/\S+/g)
    .map(item => (item.match(/[^0-9]+/g) ? item : null))
    .filter(w => w);

export { raf, ric, getSeedFromAnyString };
