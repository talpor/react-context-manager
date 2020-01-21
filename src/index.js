// import ContextProvider, { Context } from './provider';
import React from 'react';

import bindActions from './binding';

const contextManager = {version: '0.0.1'};

export const buildContext = (store, actions) => React.createContext({ actions, ...store });
// export let Context;

const ContextProvider = ({ store, actions, children }) => {
  const bindedActions = bindActions(store, actions);
  contextManager.Context = contextManager.Context || buildContext(store, bindedActions);
  const value = {
    actions: bindedActions,
    ...store
  };

  return (
    <contextManager.Context.Provider value={value}>
      {children}
    </contextManager.Context.Provider>
  );
};

contextManager.ContextProvider = ContextProvider;

export default contextManager;

