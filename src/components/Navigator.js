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
    this.navigator = {}

    this.routeStack = [];

    this.state = {
      currentRoute : {}
    };

  }

  componentWillMount() {
    
    if (this.initialRouteStack) {
      this.props.initialRouteStack.forEach(route => this.routeStack.push({...route}));
    }
    this.routeStack.push({...this.props.initialRoute});

    const currentRoute = this.routeStack[this.routeStack.length - 1]

    this.setState({ currentRoute });    
  }

  render() {
    return (
      <sg-navigation>
        {this.renderRoute(this.state.currentRoute)}
      </sg-navigation>
    );
  }

}