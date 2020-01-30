import React, { useReducer } from 'react';
import mapContextToProps from './hoc';
import { getContext } from './hooks';
import createContext from './manager';
import { injectCallback } from './utils';
const contextManager = {
  version: '0.0.1',
  Contexts: {}
};

const dispatching = dispatch => scope => action => args => dispatch([scope, action, args]);

const reducer = (state, args) => {
  const [scope, func, ...funcArgs] = args;
  return { ...state,
    [scope]: { ...func(state, ...funcArgs)
    }
  };
};

const binding = _ => action => (...args) => action(...args);

const ContextProvider = ({
  store,
  actions,
  children,
  name = 'root'
}) => {
  const [state, dispatcher] = useReducer(reducer, store); // const boundActions = injectCallback(actions, binding);

  const dispatcherActions = injectCallback(actions, dispatching(dispatcher));
  const Context = createContext(contextManager)(state, dispatcherActions, name);
  const value = {
    actions: dispatcherActions,
    ...state
  };
  return React.createElement(Context.Provider, {
    value: value
  }, children);
};

contextManager.ContextProvider = ContextProvider;
contextManager.mapStoreToProps = mapContextToProps(contextManager);
contextManager.mapActionsToProps = mapContextToProps(contextManager, 'actions');
contextManager.getContext = getContext(contextManager);
export default contextManager;