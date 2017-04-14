"use strict"

import React from 'react'

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
   * @param {Boolean}         overlay - lock the splitter content by a mask
   * @param {Function}        onOpen - Call when the Spliter side is opened 
   * @param {Function}        onPreOpen - Call before opening the Spliter side 
   * @param {Function}        onClose - Call when the Spliter side is closed 
   * @param {Function}        onPreClose - Call before closing the Spliter side 
   *  
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
    console.log(this.instance.style.animation)
    if (this.instance) {
      if (/forwards/.test(this.instance.style.animation)) {
        this.instance.style.display = 'block';
      } else if (/reverse/.test(this.instance.style.animation)) {
        this.instance.style.display = 'none';
      }
      this.instance.style.animation = null;          
    }
    if (this.props.onAnimationEnd) {
      this.props.onAnimationEnd();
    }
  }

}

SideBar.propTypes = {
  side : React.PropTypes.oneOf(['left', 'right']),
  width : React.PropTypes.oneOfType([
    React.PropTypes.string, 
    React.PropTypes.number
  ])
};

SideBar.sgType = 'side-bar';
export default SideBar;