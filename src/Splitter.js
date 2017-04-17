/* Deprecated */
"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

import util from './lib/util'

/**
 * Splitter component
 * @extends BaseComponent 
 * */
class Splitter extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = { width : null };

    this.instance = null;

    this.bind('_getInstance', 'getWidthReactively');

  }

  componentWillMount() {
    this.getWidthReactively();
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.getWidthReactively, false);
    this.getWidthReactively();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getWidthReactively, false);
  }

  render() {
    // get status of splitter side
    let isSideOpen = false;
    let lockContent = false;
    let collapse = false;
    let width = '200px';
    let side = 'left'
    React.Children.forEach(this.props.children, child => {
      if (child.type && child.type.sgType === 'splitter-side') {
        isSideOpen = child.props.isOpen || false;
        lockContent = child.props.shouldLockContent || false;
        collapse = child.props.collapse || false;
        width = child.props.width || '200px';
        side = child.props.side || 'left';
        return;
      }      
    });

    const children = React.Children.map(this.props.children, child => {
      if (collapse && child.type && child.type.sgType === 'splitter-content') {
        const style = {};
        if (side === 'right') {
          style.right = width;
        } else {
          style.left = width;
        }
        if (this.state.width) {          
          let sideWidth = width;
          if (!util.isNumber(sideWidth)) {            
            sideWidth = sideWidth.trim().replace('px','');
          }          
          const contentWidth = this.state.width - parseInt(sideWidth);
          style.width = `${contentWidth}px`;
        }
        return React.cloneElement(child, {style});
      } else {
        return child;
      }
    });

    // prepare masking
    const masking = !collapse && lockContent ? isSideOpen ? 'masking' : '' : '';
    return (
      <sg-splitter>
        <div className = 'splitter' ref = {this._getInstance}>
          {children}
          <div className = {masking} />
        </div>
      </sg-splitter>
    );
  }

  getWidthReactively() {
    if (this.instance) {
      const width = parseInt(this.instance.clientWidth);
      this.setState({ width });
    }  
  }

  _getInstance(el) {
    this.instance = el;
  }

}

Splitter.sgType = 'splitter';
export default Splitter;