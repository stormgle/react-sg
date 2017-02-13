"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

import _ from '../lib/util'
import log from '../lib/log'
import { createAnimStyle } from '../lib/animation'

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
      '_getInitialRoutesFromProps',
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

    const routeStack = this._getInitialRoutesFromProps();

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

  /**
   * @param {Any} route
   * @param {Object} options
   */
  push(route, options = {}) {
    // add new route with animation
    const anim = options.animation || this.props.animation || 'none'; 
    const animOptions = options.animationOptions || this.props.animationOptions || null;
    let animation = null;   
    if (anim && anim !== 'none') { 
      const _animOptions = {...animOptions};   
      _animOptions.direction = 'reverse';
      _animOptions.duration = _animOptions.duration || 250;
      animation = createAnimStyle(anim, _animOptions);
      // clear animation after duration
      const to = _animOptions.duration + 50;
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

  /**
   * @param {Any} route
   * @param {Object} options (multiple, animation, animationOptions)
   */
  pop(options = {}) {
    if (this.state.routeStack.length > 1) {
      // add animation for page pop out of screen
      const anim = options.animation || this.props.animation || 'none';
      const animOptions = options.animationOptions || this.props.animationOptions || null;
      let to = 0;
      if (anim && anim !== 'none') {
        const _animOptions = {...animOptions}; 
        _animOptions.duration = _animOptions.duration || 250;
        const routeStack = this.state.routeStack;
        routeStack[routeStack.length-1].animation = createAnimStyle(anim, _animOptions);
        to = _animOptions.duration + 50;
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

  /**
   * @param {Array} routes
   * @param {Object} options
   */
  reset(routes, options = {}) {     
    let routeStack = [];
    if (routes && _.isObject(routes) && (routes.animation || routes.animationOptions)) {
      options = routes;
      routes = null;
    }
    if (routes && _.isArray(routes)) {     
      // reset stack and initialize with new routes
      routeStack = this._pushToRouteStack(routes);
    } else {      
      /* if there is only one page in route stack and user reset to that page,
         reset should take no action, animation should not apply */
      if (this.state.routeStack.length === 1) {
        return this.navigator;
      }
      // reset to first route
      const route = this.state.routeStack[0];  
      route.lock = false;    
      routeStack = [route];            
    }
    // apply animation if any
    const anim = options.animation || this.props.animation || 'none';
    const animOptions = options.animationOptions || this.props.animationOptions || null;
    if (anim && anim !== 'none') {
      const _animOptions = {...animOptions}; 
      _animOptions.duration = _animOptions.duration || 250;
      const route = this.state.routeStack[this.state.routeStack.length-1];
      route.animation = createAnimStyle(anim, _animOptions);
      routeStack.push(route);
      routeStack[routeStack.length-2].lock = true;
      // popout top page after finish animation
      const to = _animOptions.duration + 50;
      setTimeout(() => {
        const routeStack = this._popFromRouteStack(this.state.routeStack);
        routeStack[routeStack.length-1].lock = false;
        this.setState({ routeStack });
      }, to); 
    }
    this.setState({ routeStack }); 
    return this.navigator;
  }

  _pushToRouteStack(routes, stack = [], options = {}) {
    const routeStack = stack.length > 0 ? stack : [];
    if (!_.isArray(routes)) {
      routes = [routes];
    }
    routes.forEach(route => {
      uKey++;
      routeStack.push({ _$key : uKey, lock : true, route, ...options })
    });
    if (routeStack.length > 0) {
      routeStack[routeStack.length-1].lock = false;
    }    
    return routeStack;
  }

  _popFromRouteStack(stack) {
    const routeStack = stack;
    if (routeStack.length > 1) {
      routeStack.pop();
    }    
    return routeStack;
  }

  _getInitialRoutesFromProps() {
    let routeStack = [];
    if (this.props.initialRouteStack) {
      routeStack = this._pushToRouteStack(this.props.initialRouteStack);      
    }
    if (this.props.initialRoute) {
      routeStack = this._pushToRouteStack(this.props.initialRoute, routeStack);      
    } 
    return routeStack;
  }

}