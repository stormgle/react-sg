"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

/**
 * Splitter component
 * @extends BaseComponent 
 * */
class Splitter extends BaseComponent {
  
  render() {
    // get status of splitter side
    let isSideOpen = false;
    let lockContent = false;
    let collapse = false;
    React.Children.forEach(this.props.children, child => {
      if (child.type && child.type.sgType === 'splitter-side') {
        isSideOpen = child.props.isOpen || false;
        lockContent = child.props.shouldLockContent || false;
        collapse = child.props.collapse || false;
        return;
      }      
    });
    // prepare masking
    const masking = !collapse && lockContent ? isSideOpen ? 'masking' : '' : '';
    return (
      <sg-splitter>
        <div className = 'splitter'>
          {this.props.children}
          <div className = {masking} />
        </div>
      </sg-splitter>
    );
  }

}

Splitter.sgType = 'splitter';
export default Splitter;