import { useReducer } from 'react';

const reducer = (action) => (state, args) => {
  const newState = action(state, ...args);
  return { ...state, ...newState };
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
};

export default bindActions;
