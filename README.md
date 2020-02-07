# React Context Manager

A lightweight manager for your Context API's.

It helps you to set a standard for your React apps using Context API.

We recommend you to use this along with our custom [CLI](https://github.com/talpor/react-context-manager-cli).

For TypeScript documentation, [click here](#).

## Influences

React Context Manager obtained some ideas from [Redux](https://github.com/reduxjs/redux), such as the structure for actions and some HOC functions for class-based components, but avoiding a lot of extra verbosity and complexity by using React's own Context API.

## Instalation

To add `react-context-manager` to your project run the following command in your project folder:

With **npm**:

```
npm install --save react-context-manager
```

With **yarn**:

```
yarn add react-context-manager
```

**Note:** React Context Manager works with React >= 16.8, because it uses [hooks](https://reactjs.org/docs/hooks-intro.html) internally.

## Basic Concepts

### Store

This is the data structure of your context. It should be divided by app or by scope, according to your application needs.

The objects inside your scope can be whatever you want and you can access them directly, so we removed the need of using selectors, unlike Redux, though you can still use them if you wish to.

Here is an example:

```jsx
const store = {
  team: {
    token: 'ReactContextManagerRocks',
    colaborators: [
      { email: 'jperozo@talpor.com' },
      { email: 'mrondon@talpor.com' },
      { email: 'fgalindez@talpor.com' },
      ...
      { email: '[youremail]@[yourdomain].com' },
    },
  },
  test: {
    test1: 'TEST',
  }
};
```

### Actions

This is how you change the context throughout the component tree. The actions have to be placed inside a scope under the same name as the store portion it changes.

Also, the dispatcher injects the current state portion to the action in case data is needed there.

Finally, actions should return the next state of the application, as shown in this next example:

```jsx
const actions = {
  team: {
    addColaborator: (state) => (email) => {
      const colaborators = [
        ...state.colaborators,
        {email: '[youremail]@[yourdomain].com'}
      ];
      return { ...state, colaborators };
    },
  },
  test: {
    actionTest: (state) => (text) => {
      return {
        ...state,
        test: {
           ...state.test,
           text
        }
      };
    }
  }
};
```


## Usage

In order to create a context you need to import a `ContextProvider` around the component tree where you want to use it. Here we set it on the root, but it can be done anywhere on the component tree:

***index.jsx***
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { ContextProvider, initContext } from 'react-context-manager';

const context = initContext();

const actions = {
  test: {
    actionTest: (state) => (text) => {
      return {
        ...state,
        test: {
           ...state.test,
           test1: text
        }
      };
    }
  }
};

const store = {
  test: {
    test1: 'TEST',
  }
};

ReactDOM.render(
  <ContextProvider actions={actions} store={store} context={context}>
    <App />
  </ContextProvider>,
  document.getElementById('root')
);
```

### ContextProvider's Props

| ***Name***    | ***Default*** |***Required***|***Description***                                                                        |
| ------------- |---------------|--------------|-----------------------------------------------------------------------------------------|
| store         | N/A           |True          | This is the initial store of your context. For more info, re-visit the previous section.|
| actions       | N/A           |True          | Actions that are to be made avaible on the context.                                     |
| context       | N/A           |True          | Context used through the provider's children.                                           |


***App.jsx***
```jsx
import React, { useContext, useEffect } from 'react';

import { context } from '../index.jsx';


function App() {
  const context = useContext(context);
  useEffect(() => {
    context.actions.test.actionTest('Hello World!');
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {context.test.test1}<br/>
        </p>
        <button
          className="App-link"
          onClick={() => {
            context.actions.test.actionTest('Bye World!')
          }}
        >
          Say Goodbye!
        </button>
      </header>
    </div>
  );
}

export default App;

```

***And that's it!***

That's the way we get our context along the application and the only thing you need to worry about is creating powerful actions.

## Backwards compatibility

We understand not all projects would want to use function-based components and, thinking of that, we implemented a HOC (High Order Component) called `mapContextToProps` (very similar to Redux), in order to inject the context as props in your component, as you can see next:

```jsx
import React from 'react';

import {
  mapContextToProps
} from 'react-context-manager';

import { context } from '../index.js'

class BaseApp extends React.Component {
  componentDidMount() {
    this.props.actions.test.actionTest('Hello World!');
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {this.props.store.test.test1}<br/>
          </p>
          <button
            className="App-link"
            onClick={() => {
              this.props.actions.test.actionTest('Bye World!')
            }}
          >
            Say Goodbye!
          </button>
        </header>
      </div>
    );
  }
}

export default mapStoreToProps(context)(BaseApp)('test');
```

