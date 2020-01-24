
export const injectCallback = (actions, callback) => {
  const injectedCallbacks = {};
  Object.keys(actions).forEach(scope => {
    injectedCallbacks[scope] = {};
    Object.keys(actions[scope]).forEach(action => {
      injectedCallbacks[scope][action] = callback(scope)(actions[scope][action])
    });
  });

  return injectedCallbacks;
};
