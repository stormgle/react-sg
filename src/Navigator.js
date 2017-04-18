"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

import util from './lib/util'
import log from './lib/log'
import { ANIMATION, createAnimStyle, validateAnimationName } from './lib/animation'

let uKey = 0;

/**
 * Navigator component
 * @extends BaseComponent 
 * */
class Navigator extends BaseComponent {
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
      reset : this.reset.bind(this),
      getCurrentRoute : this.getCurrentRoute.bind(this),
      getRouteStack : this.getRouteStack.bind(this)
    };

    this.state = {
      routeStack : []
    };

    this.bind(
      '_getInitialRoutesFromProps',
      '_pushToRouteStack', '_popFromRouteStack', '_push', '_pop', 'reset',
      'getCurrentRoute', 'getRouteStack'
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
    const onPrePush = options.onPrePush || this.props.onPrePush || undefined;
    const onPostPush = options.onPostPush || this.props.onPostPush || undefined;
    if (onPrePush) { 
      const route = this.getCurrentRoute();
      onPrePush(route);
    }    
    return this._push(route, options, onPostPush);
  }

  /**
   * @param {Object} options
   */
  pop(options = {}) {    
    const onPrePop= options.onPrePop || this.props.onPrePop || undefined;
    const onPostPop = options.onPostPop || this.props.onPostPop || undefined;
    if (onPrePop) { 
      const route = this.getCurrentRoute();
      onPrePop(route);
    }
    return this._pop(options, onPostPop);
  }

  getCurrentRoute() {
    return {...this.state.routeStack[this.state.routeStack.length-1].route};
  }

  getRouteStack() {
    const stack = [];
    this.state.routeStack.forEach(entry => {
      stack.push({...entry.route});
    });
    return stack;
  }
  
  _push(route, options = {}, onFinish) {
    // add new route with animation
    const anim = options.animation || this.props.animation || 'none'; 
    const animOptions = options.animationOptions || this.props.animationOptions || null;        
    const {animation, to} =  this._genPushAnimationForTopRoute(anim, animOptions);        

    const routeStack = this._pushToRouteStack(route, this.state.routeStack, {animation});        
    routeStack[routeStack.length-1].lock = false;

    // for current route, apply animation if animation push is used, also lock it
    const animation2 = this._genPushAnimationForSecondRoute(anim, animOptions);
    routeStack[routeStack.length-2].animation = animation2;
    routeStack[routeStack.length-2].lock = true;

    this.setState({ routeStack });    

    // clear animation after duration
    setTimeout(() => {
      routeStack[routeStack.length-2].animation = null;
      routeStack[routeStack.length-1].animation = null;
      this.setState({ routeStack });
      onFinish();
    }, to);
    return this.navigator;
  }

  _pop(options = {}, onFinish) {
    if (this.state.routeStack.length > 1) {
      // add animation for page pop out of screen
      const anim = options.animation || this.props.animation || 'none';
      const animOptions = options.animationOptions || this.props.animationOptions || null;
      const {animation, to} = this._genPopAnimationForTopRoute(anim, animOptions);

      if (animation !== null) {
        const routeStack = this.state.routeStack;
        routeStack[routeStack.length-1].animation = animation;
        const animation2 = this._genPopAnimationForSecondRoute(anim, animOptions);
        routeStack[routeStack.length-2].animation = animation2;
        // apply animation to behind route if animation push is used

        this.setState({ routeStack });
      }
    
      // actual pop out route from stack 
      setTimeout(() => {
        const routeStack = this._popFromRouteStack(this.state.routeStack);
        routeStack[routeStack.length-1].animation = null;
        routeStack[routeStack.length-1].lock = false;
        this.setState({ routeStack });
        onFinish();
      }, to);            
    } else {
      onFinish(); // no page to pop, just finish callback
    }
    return this.navigator;
  }

  /**
   * @param {Array} routes
   * @param {Object} options
   */
  reset(routes, options = {}) {     
    let routeStack = [];
    if (routes && util.isObject(routes) && (routes.animation || routes.animationOptions)) {
      options = routes;
      routes = null;
    }
    if (routes && util.isArray(routes)) {     
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
    if (!util.isArray(routes)) {
      routes = [routes];
    }
    routes.forEach(route => {
      uKey++;
      routeStack.push({ _$key : uKey, lock : true, route, ...options })
    });
        
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
    /* unlock only top route */
    if (routeStack.length > 0) {
      routeStack[routeStack.length-1].lock = false;
    }
    return routeStack;
  }

  _genPushAnimationForTopRoute(anim, animOptions) {

    if (/push/i.test(anim)) {
      anim = anim.replace('push','slide');      
    }

    if (validateAnimationName(anim)) { 
      const _animOptions = {...animOptions};   
      _animOptions.direction = 'forwards';
      _animOptions.duration = _animOptions.duration || ANIMATION.DEFAULT.DURATION;
      return { 
        animation: createAnimStyle(anim, _animOptions),
        to: _animOptions.duration + 50
      };      
    } else {
      return { animation: null, to: 0 };
    } 
  }

  _genPushAnimationForSecondRoute(anim, animOptions) {
    if (!/push/i.test(anim)) {
      return null;
    }

    if (validateAnimationName(anim)) { 
      anim = `${anim}-100`;
      const _animOptions = {...animOptions};   
      _animOptions.direction = 'forwards';
      _animOptions.duration = _animOptions.duration || ANIMATION.DEFAULT.DURATION;
      return createAnimStyle(anim, _animOptions);      
    } else {
      return null;
    } 
  }

  _genPopAnimationForTopRoute(anim, animOptions) {

    if (/push/i.test(anim)) {
      anim = anim.replace('push','slide');
    }

    if (validateAnimationName(anim)) { 
      const _animOptions = {...animOptions};   
      _animOptions.direction = 'reverse';
      _animOptions.duration = _animOptions.duration || ANIMATION.DEFAULT.DURATION;
      return { 
        animation: createAnimStyle(anim, _animOptions),
        to: _animOptions.duration + 50
      };      
    } else {
      return { animation: null, to: 0 };
    } 

  }

  _genPopAnimationForSecondRoute(anim, animOptions) {

    if (!/push/i.test(anim)) {
      return null;
    }

    if (validateAnimationName(anim)) { 
      anim = `${anim}-100`;
      const _animOptions = {...animOptions};   
      _animOptions.direction = 'reverse';
      _animOptions.duration = _animOptions.duration || ANIMATION.DEFAULT.DURATION;
      return createAnimStyle(anim, _animOptions);      
    } else {
      return null;
    } 

  }
}

Navigator.sgType = 'navigator';
export default Navigator;