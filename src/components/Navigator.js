"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

/**
 * Navigator component
 * @extends BaseComponent 
 * */
export default class extends BaseComponent {
  /**
   * Navigator component that render Page for each Route
   * @param {Array} initialRouteStack - Array contains the initial routes from the Navigator
   * @param {Object} initialRoute - The initial routes of the Navigator
   * @param {Function} renderRoute
   * @param {Function} onPrePush
   * @param {Function} onPostPush
   * @param {Function} onPrePop
   * @param {Function} onPostPop
   * @param {Object} animation
   */
  constructor(props) {
    super(props);

    /**
     * 
     * push
     * pop
     * resetRoute
     * resetRouteStack
     * */
    this.navigator = { 
      push : this.push.bind(this) ,
      pop : this.pop.bind(this),
    };

    this.state = {
      routeStack : []
    };

    this.bind(
      'push', 'pop',
    );

  }

  componentWillMount() {
    const routeStack = [];
    if (this.props.initialRouteStack) {
      this.props.initialRouteStack.forEach(route => routeStack.push(route));
    }
    routeStack.push(this.props.initialRoute);
    this.setState({ routeStack });
  }

  render() {
    return (
      <sg-navigation>
        {this.state.routeStack.map( (route, id) => {
          return (
            <div className = 'nav-frame'>
              {this.props.renderRoute(route, this.navigator)}
            </div>
          );
        })}
      </sg-navigation>
    );
  }

  push(route) { 
    const routeStack = [...this.state.routeStack];  
    routeStack.push(route);
    this.setState({ routeStack });
    return this.navigator;
  }

  pop(route) {
    if (this.state.routeStack.length > 1) {
      const routeStack = [...this.state.routeStack];
      routeStack.pop();
      this.setState({ routeStack });      
    }
    return this.navigator;
  }

}