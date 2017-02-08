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
      push : this.push.bind(this) 
    };

    this.routeStack = [];

    this.state = {
      currentRoute : {}
    };

    this.bind(
      '_updateCurrentRoute',
      'push'
    );

  }

  componentWillMount() {

    if (this.props.initialRouteStack) {
      this.props.initialRouteStack.forEach(route => this.routeStack.push(route));
    }
    this.routeStack.push(this.props.initialRoute);

    this._updateCurrentRoute();
        
  }

  render() {
    return (
      <sg-navigation>
        {this.props.renderRoute(this.state.currentRoute, this.navigator)}
      </sg-navigation>
    );
  }

  push(route) {
    this.routeStack.push(route);
    this._updateCurrentRoute();
    return this.navigator;
  }

  _updateCurrentRoute() {
    const currentRoute = this.routeStack[this.routeStack.length - 1]
    this.setState({ currentRoute });
    return this;
  }

}