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
      '_extractAnimation', '_animateEnter', '_animateExit',
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
        }, 'resolve');
      }
    }

    if (this.props.reject) {
      this.popup.reject = (...args) => {       
        this._animateExit(() => {
          this._reject(...args);
        }, 'reject');          
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

    const mask = this.props.options ? this.props.options.mask : undefined;

    let _class = "__page_popup_mask";
    let _style = {opacity: '0.5', zIndex : '-1'};

    if (mask) {
      if(util.isString(mask)) {
        _class = `${_class} ${mask}`;
      } else {
        _style = {..._style, ...mask};
      }
    }

    return (
      <div className = "__page_popup" >
        <div className = {_class} style = {_style} />
        <div className = "__page_popup_diaglog" style = {{...animation}}>
          <div className = "__page_popup_floater" />
          <div className = "__page_popup_child w3-card-4"  >
            {this.props.children}
          </div>
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

  _extractAnimation(options, when) {
    if (options && 
      options.animation && 
      options.animation[when]) {

      let name;  
      if (util.isObject(options.animation[when])) {
        name = this.props.options.animation[when].name || 'slide-top';
      } else if (util.isString(this.props.options.animation[when])) {
        name = this.props.options.animation[when];
      } else {
        /* catch error here */
      }

      const duration = this.props.options.animation[when].duration || ANIMATION.DEFAULT.DURATION;

      return {name, duration};

    } else {
      return {name: null, duration: null}; // fix bug of return undefined object
    }
  }

  _animateEnter() {
    const {name, duration} = this._extractAnimation(this.props.options, 'enter');
    if (name) {
      this.setState({
        animation: {
          enter: {name, duration},
          exit: null
        }
      });
    }
  }

  _animateExit(callback, act) {
    let name;
    let duration;
    if (act && this.props.options && 
        this.props.options.animation && this.props.options.animation[act]) {
        const animation = this._extractAnimation(this.props.options, act);
        name = animation.name;
        duration = animation.duration;
    } else {
      const animation = this._extractAnimation(this.props.options, 'exit');
       name = animation.name;
       duration = animation.duration;
    }
    
    if (name) {
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

/* Popup utilities for creating common diaglog */

function alert({title = '', message = '', label = null, onClose = null, options = null}) {
  let _popup = null;
  const diag = (
    <Popup onInit = {popup => {_popup = popup}} >
      <div style={{maxWidth: '250px', backgroundColor: 'white'}} >

        <header className = 'w3-container w3-red'>
          <h4> {title} </h4>
        </header>

        <div className="w3-container">
          {
            util.isString(message) ? 
              <p> {message} </p> : 
              <div> {message} </div>
          }
        </div>


        <button className = 'w3-button w3-block w3-white w3-border-top' 
                onClick = {() => {if (_popup) {_popup.resolve()} }} > 
          { label && util.isString(label) ? label : 'Close' } 
        </button>

      </div>
    </Popup>
  );
  return {
    diag: diag,
    resolve: onClose || function(){},
    reject: onClose|| function(){},
    options
  };
}


function confirm({title = '', message = '', label = null, onAccept = null, onDecline = null, options = null}) {
  let _popup = null;
  const diag = (
    <Popup onInit = {popup => {_popup = popup}} >
      <div style={{maxWidth: '250px', backgroundColor: 'white'}} >

        <header className = 'w3-container w3-red'>
          <h4> {title} </h4>
        </header>

        <div className="w3-container">
          {
            util.isString(message) ? 
              <p> {message} </p> : 
              <div> {message} </div>
          }
        </div>

        <div className = 'w3-white w3-border-top w3-row' >
          <div className = 'w3-half' >
            <button className = 'w3-button w3-block w3-white' 
                    onClick = {() => {if (_popup) {_popup.resolve()} }} > 
              {label && label.acceptButton ? label.acceptButton : 'Accept'} 
            </button>
          </div>
          <div className = 'w3-half' >
            <button className = 'w3-button w3-block w3-white' 
                    onClick = {() => {if (_popup) {_popup.reject()} }} > 
              {label && label.declineButton ? label.declineButton : 'Decline'} 
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
  return {
    diag: diag,
    resolve: onAccept || function(){},
    reject: onDecline|| function(){},
    options
  };
}



export const diag = {
  alert,
  confirm
};