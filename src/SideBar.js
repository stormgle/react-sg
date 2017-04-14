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
  }

  render() {
    const style = this.props.style;
    const w3class = this.props.w3class;
    return (
      <sg-sidebar>
        <div className = {w3class} style = {style} >
           {this.props.children}
        </div>
      </sg-sidebar>
    );
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