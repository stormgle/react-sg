"use strict"

import React from 'react'
import PropTypes from 'prop-types'

import BaseComponent from './BaseComponent'
import util from "./lib/util"
import { ANIMATION, createAnimStyle, validateAnimationName } from './lib/animation'

class Popup extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = { 
      animation: {enter: null, exit: null} 
    };

    this.popup = {};

    this.bind(
      '_createEnterAnimation', '_createExitAnimation',
      '_animateEnter', '_animateExit',
      '_resolve', '_reject'
    );

  }

  componentWillMount() {
    if (this.props.page) {
      this.popup.parent = this.props.page; 
    }

    if (this.props.resolve) {
      this.popup.resolve = (...args) => {
        this._animateExit(() => {
          this._resolve(...args);
        });
      }
    }

    if (this.props.reject) {
      this.popup.reject = (...args) => {       
        this._animateExit(() => {
          this._reject(...args);
        });          
      }
    }

    if (this.props.onInit) {
      this.props.onInit(this.popup);
    }

    this._animateEnter();

  }


  render() {
    let animation = null;
    if (this.state.animation.enter) {
      animation = this._createEnterAnimation();
      const duration = this.state.animation.duration || ANIMATION.DEFAULT.DURATION;
      // clean animation after timeout
      setTimeout(() => {
        this.setState({animation: {enter: null, exit: null} });
      }, duration + 50);
    }
    if (this.state.animation.exit) {
      animation = this._createExitAnimation();
    }

    return (
      <div className = "__page_popup" style = {{...animation}} >
        <div className = "__page_popup_floater" />
        <div className = "__page_popup_child w3-card-4"  >
          {this.props.children}
        </div>
      </div>
    );
  }

  _createEnterAnimation() {
    if (this.state.animation.enter) {
      const anim = this.state.animation.enter;
      return createAnimStyle(anim.name, {
        duration : anim.duration | ANIMATION.DEFAULT.DURATION,
        direction : 'forwards'
      });
    } else {
      return null;
    }
  }

  _createExitAnimation() {
    if (this.state.animation.exit) {
      const anim = this.state.animation.exit;
      return createAnimStyle(anim.name, {
        duration : anim.duration | ANIMATION.DEFAULT.DURATION,
        direction : 'reverse'
      });
    } else {
      return null;
    }
  }

  _animateEnter() {
    if (this.props.options && 
      this.props.options.animation && 
      this.props.options.animation.enter) {

      let name;  
      if (util.isObject(this.props.options.animation.enter)) {
        name = this.props.options.animation.enter.name || 'slide-top';
      } else if (util.isString(this.props.options.animation.enter)) {
        name = this.props.options.animation.enter;
      } else {
        /* catch error here */
      }

      const duration = this.props.options.animation.enter.duration || ANIMATION.DEFAULT.DURATION;

      this.setState({
        animation: {
          enter: {name, duration},
          exit: null
        }
      });

    }
  }

  _animateExit(callback) {
    if (this.props.options && 
      this.props.options.animation && 
      this.props.options.animation.exit) {

      let name;  
      if (util.isObject(this.props.options.animation.exit)) {
        name = this.props.options.animation.exit.name || 'slide-top';
      } else if (util.isString(this.props.options.animation.exit)) {
        name = this.props.options.animation.exit;
      } else {
        /* catch error here */
      }

      const duration = this.props.options.animation.exit.duration || ANIMATION.DEFAULT.DURATION;

      // set exit animation
      this.setState({
        animation: {
          exit: {name, duration},
          enter: null
        }
      });
      
      setTimeout(() => {
        this.setState({animation: {enter: null, exit: null}});
        callback();
      }, duration);
      

    } else {
      callback();
    }
  }
  _resolve(...args) {
    if (this.popup.parent) {
      this.popup.parent.closePopup();
    }
    if (this.props.resolve) {
      this.props.resolve(...args);
    }
  }

  _reject(...args) {
    if (this.popup.parent) {
      this.popup.parent.closePopup();
    }
    if (this.props.reject) {
      this.props.reject(...args);
    } 
  }

}

Popup.PropTypes = {
  page: PropTypes.object,
  resolve: PropTypes.func,
  reject: PropTypes.func,
  onInit: PropTypes.func
};

Popup.sgType = 'popup';
export default Popup;