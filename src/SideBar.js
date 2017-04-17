"use strict"

import React from 'react'
import PropTypes from 'prop-types'

import BaseComponent from './BaseComponent'

/**
 * SideBar Component
 * @extends BaseComponent 
 * */
class SideBar extends BaseComponent {

  /**
   * Render a Splitter Side insile the Splitter   
   * @param {String}          side - position Left or Right
   * @param {Number}          width - width of Splitter side. number represent for pixel unit
   * @param {Boolean|String}  collapse - specify collapse behavior, if 'auto' sidebar will collapse on large screen  
   * @param {Boolean}         isOpen - true to show the component
   * @param {Function}        onClickOutside - callback function to call when click outside sidebar
   * @param {String}          backgroundColor - background color of side bar, also support w3 color class name
   * @param {Boolean}         border - add a border to side bar
   * @param {String}          card - display side bar as a w3 card. Valid value: card, card-2, card-4
   * @param {Boolean}         overlay - lock the splitter content by a mask
   * @param {Function}        onOpen - Call when the Spliter side is opened 
   * @param {Function}        onPreOpen - Call before opening the Spliter side 
   * @param {Function}        onClose - Call when the Spliter side is closed 
   * @param {Function}        onPreClose - Call before closing the Spliter side 
   * @param {String}          animation - define animation
   * @param {Object}          animationOptions - define animation option 
   */
  constructor(props) {
    super(props);

    this.instance = null;

    this.bind('_getInstance', 'onAnimationEnd');

  }

  componentDidMount() {
    if (this.instance) {
      this.instance.addEventListener('webkitAnimationEnd', this.onAnimationEnd, false);
      this.instance.addEventListener('animationend', this.onAnimationEnd, false);
    }
  }

  componentWillUnmount() {
    if (this.instance) {
      this.instance.removeEventListener('webkitAnimationEnd', this.onAnimationEnd, false);
      this.instance.removeEventListener('animationend', this.onAnimationEnd, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props.onSideBarPropsChange(this.props, nextProps);
  }

  render() {
    const style = this.props.style;
    const w3class = this.props.w3class;
    return (
      <sg-sidebar>
        <div className = {w3class} style = {style} ref = {this._getInstance} >
           {this.props.children}
        </div>
      </sg-sidebar>
    );
  }

  _getInstance(el) {
    this.instance = el;
  }

  onAnimationEnd() {
    if (this.props.onAnimationEnd) {
      this.props.onAnimationEnd();
    }
  }

}

SideBar.propTypes = {
  side: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.number
  ]),
  border: PropTypes.bool
};

SideBar.sgType = 'side-bar';
export default SideBar;