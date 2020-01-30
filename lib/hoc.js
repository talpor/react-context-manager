function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
export const parseField = (store, rawField) => {
  const parts = rawField.split(':');

  if (parts.length > 1) {
    const [namespace, field] = parts;
    return {
      [field]: store[namespace][field]
    };
  } else {
    return {
      [rawField]: store[rawField]
    };
  }
};

const storeSelector = (store, fields) => {
  const out = fields.reduce((newStore, field) => ({ ...newStore,
    ...parseField(store, field)
  }), {});
  return out;
};

const mapContextToProps = (module, requiredScope = 'store') => WrappedComponent => (storeFields, contextName = 'root') => props => {
  const Context = module.Contexts[contextName];
  return React.createElement(Context.Consumer, null, store => {
    const injectedProp = {
      [requiredScope]: storeSelector(requiredScope !== 'store' ? store[requiredScope] : store, storeFields)
    };
    return React.createElement(WrappedComponent, _extends({}, props, injectedProp));
  });
};

export default mapContextToProps;