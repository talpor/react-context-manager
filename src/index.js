import React from 'react';

import bindActions from './binding';
import mapContextToProps from './hoc';

const contextManager = {version: '0.0.1'};

export const buildContext = (store, actions) => React.createContext({ actions, ...store });

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
contextManager.mapStoreToProps = mapContextToProps(contextManager);
contextManager.mapActionsToProps = mapContextToProps(contextManager, 'actions');

export default contextManager;

