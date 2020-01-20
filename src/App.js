import React, { useContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { Context } from './store/provider';


function App() {
  const context = useContext(Context);
  useEffect(() => {
    context.actions.test.actionTest('Hello World');
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {context.test.test1}
        </p>
        <button
          className="App-link"
          onClick={() => { context.actions.test.actionTest('Changed') }}
        >
          Change
        </button>
      </header>
    </div>
  );
}

export default App;
