"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

/**
 * SplitterSide component
 * @extends BaseComponent 
 * */
class SplitterSide extends BaseComponent {

  /**
   * Render a Splitter Side insile the Splitter   
   * @param {String} side - position Left or Right
   * @param {Boolean} isOpen - true to show the component
   * @param {Boolean} shouldLockContent - lock the splitter content by a mask
   * @param {String} maskColor - color of the mask (not implement yet)
   * @param {String} maskOpacity - opacity of the mask (not implement yet)
   *  
   */
  constructor(props) {
    super(props);

    this.state = {
      width : 0
    };

    this.instance = null;

    this.bind('_getInstance')

  }

  componentDidMount() {
    this.setState({width : this.instance.clientWidth + 1});
  }

  render() {
    const isOpen = this.props.isOpen || false;
    const side = this.props.side || 'left';
    const style = side === 'left' ?
                   isOpen ? {left: 0}  : {left: `-${this.state.width}px`} :
                   isOpen ? {right: 0} : {right: `-${this.state.width}px`};

    return (
      <sg-splitter-side ref = {this._getInstance} style = {style}>
        {this.props.children}        
      </sg-splitter-side>
    );
  }

  _getInstance(el) {
    this.instance = el;
  }

}

SplitterSide.sgType = 'splitter-side';
export default SplitterSide;