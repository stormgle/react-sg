"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

import log from '../util/log'
import { createAnimStyle } from '../util/animation'

let uKey = 0;

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
     * reset
     * */
    this.navigator = { 
      push : this.push.bind(this) ,
      pop : this.pop.bind(this),
      reset : this.reset.bind(this)
    };

    this.state = {
      routeStack : []
    };

    this.bind(
      '_pushToRouteStack', '_popFromRouteStack', 'push', 'pop', 'reset'
    );

  }

  componentWillMount() {
    if (!this.props.initialRoute && !this.props.initialRouteStack) {
      log.error({
        root : 'Navigator', 
        message : 'Could not find an initial route',
        detail : 'At least initialRoute or initialRoutStack must be defined'
      });
    }

    let routeStack = [];
    if (this.props.initialRouteStack) {
      routeStack = this._pushToRouteStack(this.props.initialRouteStack);      
    }
    if (this.props.initialRoute) {
      routeStack = this._pushToRouteStack(this.props.initialRoute, routeStack);      
    }    
    this.setState({ routeStack });
  }

  render() {
    return (
      <sg-navigation>
        {this.state.routeStack.map( stackEntry => {      
          const animation = stackEntry.animation || {};
          const lock = stackEntry.lock ? 'lock' : '';
          return (
            <div className = {`nav-frame ${lock}`} style = {animation} key = {stackEntry._$key} >
              {this.props.renderRoute(stackEntry.route, this.navigator)}
            </div>
          );
        })}
      </sg-navigation>
    );
  }

  push(route, options = {}) {
    // add new route with animation
    const anim = options.animation || this.props.animation || null; 
    let animation = null;   
    if (anim && anim !== 'none') { 
      const _anim = {...anim};   
      _anim.direction = 'reverse';
      _anim.duration = _anim.duration || 250;
      animation = createAnimStyle(_anim);
      // clear animation after duration
      const to = _anim.duration + 50;
      setTimeout(() => {
        routeStack[routeStack.length-1].animation = null;
        this.setState({ routeStack });
      }, to);
    }      
    const routeStack = this._pushToRouteStack(route, this.state.routeStack, {animation});
    routeStack[routeStack.length-2].lock = true;
    this.setState({ routeStack });    
    return this.navigator;
  }

  pop(options = {}) {
    if (this.state.routeStack.length > 1) {
      // add animation for page pop out of screen
      const anim = options.animation || this.props.animation || null;
      const to = anim && anim !== 'none' ? anim.duration ? anim.duration + 50 : 300 : 0;
      if (anim && anim !== 'none') {
        const _anim = {...anim}; 
        _anim.duration = _anim.duration || 250;
        const routeStack = this.state.routeStack;
        routeStack[routeStack.length-1].animation = createAnimStyle(_anim);
        this.setState({ routeStack });
      }      
      // actual pop out route from stack 
      setTimeout(() => {
        const routeStack = this._popFromRouteStack(this.state.routeStack);
        routeStack[routeStack.length-1].lock = false;
        this.setState({ routeStack });
      }, to);            
    }
    return this.navigator;
  }

  reset(routes) {
    if (routes) {
      // reset stack and initialize with new routes
      const routeStack = this._pushToRouteStack(routes);
      this.setState({ routeStack });
    } else {      
      // reset to first route
      const route = this.state.routeStack[0];  
      route.lock = false;    
      const routeStack = [route];
      this.setState({ routeStack }); 
    }
    return this.navigator;
  }

  _pushToRouteStack(routes, stack = [], options = {}) {
    const routeStack = stack.length > 0 ? stack : [];
    if (Object.prototype.toString.call(routes) !== '[object Array]') {
      routes = [routes];
    }
    routes.forEach(route => {
      uKey++;
      routeStack.push({ _$key : uKey, route, ...options })
    });
    return routeStack;
  }

  _popFromRouteStack(stack) {
    const routeStack = stack;
    routeStack.pop();
    return routeStack;
  }

}