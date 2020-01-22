import { useReducer } from 'react';

const reducer = (action) => (state, arg) => {
  const newState = action(state, arg);
  return { ...state, ...newState };
};

const bindActions = (store, actions) => {
  const boundActions = {};
  Object.keys(actions).forEach(scope => {
    boundActions[scope] = {};
    Object.keys(actions[scope]).forEach(action => {
      [store[scope], boundActions[scope][action]] = useReducer(
        reducer(actions[scope][action]),
        store[scope]
      );
    });
  })
  return boundActions;
};

export default bindActions;
