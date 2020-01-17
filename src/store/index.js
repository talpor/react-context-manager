import React from 'react';

export const buildGlobalContext = (actions, state) => {
    const store = {
        actions: {...actions},
        ...state
    };
    return React.createContext(store);
};

export default buildGlobalContext;
