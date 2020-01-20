import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ContextProvider from './store';

const actions = {
  test: {
    actionTest: (text) => {
      return { test1: text };
    }
  }
};

const store = {
  test: {
    test1: 'TEST'
  }
};

ReactDOM.render(
  <ContextProvider actions={actions} store={store}>
    <App />
  </ContextProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
