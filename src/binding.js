/* mport { useReducer } from 'react';

const reducer = (action) => (state, args) => {
  const newState = action(state, ...args);
  re-turn { ...state, ...newState };
};

const bindActions = (store, actions) => {
  const boundActions = {};
  Object.keys(actions).forEach(scope => {
    boundActions[scope] = {};
    Object.keys(actions[scope]).forEach(action => {
      let dispatch;
      [store[scope], dispatch] = useReducer(
        reducer(actions[scope][action]),
        store[scope]
      );
      boundActions[scope][action] = (...args) => dispatch(args);
    });
  })
  return boundActions;
}; */

export const injectCallback = (actions, callback) => {
  const injectedCallbacks = {};
  Object.keys(actions).forEach(scope => {
    injectedCallbacks[scope] = {};
    Object.keys(actions[scope]).forEach(action => {
      injectedCallbacks[scope][action] = callback(actions[scope][action])
    });
  });

  return injectedCallbacks;
};
