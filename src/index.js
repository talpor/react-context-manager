import React, { useReducer } from 'react';

import { injectCallback } from './binding';
import mapContextToProps from './hoc';
import { getContext } from './hooks';
import createContext from './manager';

const contextManager = { version: '0.0.1', Contexts: {} };

const binding = (action) => (args) => action(args);
const dispatching = (dispatch) => (action) => (args) => dispatch([action, args]);
// Fix scope issue
const reducer = (state, args) => {
  const [func, ...funcArgs] = args;
  return { ...state, ...func(state, funcArgs)}
};

const ContextProvider = ({ store, actions, children, name = 'root' }) => {
  const boundActions = injectCallback(actions, binding);
  const [state, dispatcher] = useReducer(reducer, store);
  const Context = createContext(contextManager)(state, dispatcher, name);
  const dispatcherActions = injectCallback(boundActions, dispatching(dispatcher));
  const value = {
    actions: dispatcherActions,
    ...state
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

contextManager.ContextProvider = ContextProvider;
contextManager.mapStoreToProps = mapContextToProps(contextManager);
contextManager.mapActionsToProps = mapContextToProps(contextManager, 'actions');
contextManager.getContext = getContext(contextManager);

export default contextManager;

