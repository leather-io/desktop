const createObserver = store => (selector, callback) => {
  let oldState = {};
  return store.subscribe(() => {
    let selectedState = selector(store.getState());
    Object.entries(selectedState).map(([key, value]) => {
      if (oldState[key] !== value) {
        callback(value, oldState[key]);
        oldState[key] = value;
      }
    });
  });
};

export { createObserver };
