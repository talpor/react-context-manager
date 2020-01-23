import React from 'react';

import bindActions from './binding';
import mapContextToProps from './hoc';
import { getContext } from './hooks';
import createContext from './manager';

const contextManager = { version: '0.0.1', Contexts: {} };

const ContextProvider = ({ store, actions, children, name = 'root' }) => {
  const boundActions = bindActions(store, actions);
  const Context = createContext(contextManager)(store, boundActions, name);
  const value = {
    actions: boundActions,
    ...store
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

