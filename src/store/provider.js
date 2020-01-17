import React, { Component, Children } from 'react';

import bindActions from './binding';
import { buildGlobalContext } from '.';

class ContextProvider extends Component {

  setUtils(child) {
    const { actions, store } = this.state || {};
    return React.cloneElement(child, {
      context: { actions, store },
    });
  }

  setChildren(children) {
    const child = Children.only(children);
    // let newChildren;

    // if (child.props.children) {
    //   // set actions as props of all its children
    //   newChildren = child.props.children.map(element => {
    //     let newElement;
    //     // if a child has children too, we call this method again recursively
    //     if (element.props.children) {
    //       newElement = this.setChildren(element);
    //     }
    //     // set actions to this element
    //     return this.setUtils(newElement || element);
    //   });
    // }

    // const props = newChildren ? { children: newChildren } : undefined;
    // // clone the element in order to obtain a new one with the new prop set
    // return React.cloneElement(child, props);
    return this.setUtils(child);
  }

  componentDidMount() {
    const context = buildGlobalContext(this.props.actions, this.props.store);
    const actions = bindActions(this, this.props);
    this.setState({ context, store: this.props.store, actions });
  }

  // componentDidUpdate(nextProps) {
  //   console.log('COMPARE',compare2Objects(this.props.actions, nextProps.actions) === false, compare2Objects(this.props.store, nextProps.store) === false)
  //   if (
  //     compare2Objects(this.props.actions, nextProps.actions) === false ||
  //     compare2Objects(this.props.store, nextProps.store) === false
  //   ) {
  //     const context = buildGlobalContext(...nextProps);
  //     const actions = bindActions(this, nextProps);
  //     this.setState({ context, store: nextProps.store, actions });
  //   }
  // }


  // actionSelector(...actions) {
  //   const out = {};
  //   const allActions = [...actions];
  //   allActions.forEach(action => {
  //     out[action] = this.state.actions[action];
  //   });
  //   return out;
  // }

  render() {
    const Node = !(this.state && this.state.context) ? 'div' : this.state.context.Provider;
    return (
      this.state && this.state.context ? <Node value={this.state}>{this.setChildren(this.props.children)}</Node> : 'Loading'
    );
  }
}

export default ContextProvider;
