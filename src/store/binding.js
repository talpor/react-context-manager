import { useReducer } from 'react';

const reducer = (action) => (state, arg) => {
  const newState = action(arg);
  return { ...state, ...newState };
};

const bindActions = (store, actions) => {
  const bindedActions = {};
  Object.keys(actions).forEach(scope => {
    bindedActions[scope] = {};
    Object.keys(actions[scope]).forEach(action => {
      [store[scope], bindedActions[scope][action]] = useReducer(
        reducer(actions[scope][action]),
        store[scope]
      );
    });
  })
  return bindedActions;
};

export default bindActions;
