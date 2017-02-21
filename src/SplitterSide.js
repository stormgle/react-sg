"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

import { createAnimStyle } from './lib/animation'

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
      width : 0,
      animation : null,
      isOpen : false
    };

    this.instance = null;

    this.bind('_getInstance');

  }

  componentDidMount() {
    this.setState({width : this.instance.clientWidth + 1});
  }

  
  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.state.isOpen) {
      let animation = null;   
      let to = 0;
      let anim = nextProps.animation || 'none';
      const animOptions = nextProps.animationOptions || null;
      if (anim && anim !== 'none') { 
        anim = `${anim}-${nextProps.side === 'right'? 'right' : 'left'}`;
        const _animOptions = {...animOptions};   
        _animOptions.direction = nextProps.isOpen ? 'reverse' : 'forwards';
        _animOptions.duration = _animOptions.duration || 250;
        animation = createAnimStyle(anim, _animOptions);      
        to = _animOptions.duration + 50;   
        this.setState({ animation, isOpen : nextProps.isOpen });
      }
      setTimeout(() => {
        this.setState({ animation : null });
      }, to);  
    }
  }

  render() {
    const isOpen = this.props.isOpen || false;
    const side = this.props.side || 'left';
    const position = side === 'right' ?
          isOpen || this.state.animation ? {right: 0} : {right: `-${this.state.width}px`}:
          isOpen || this.state.animation ? {left: 0}  : {left: `-${this.state.width}px`};                   
    const style = {...this.state.animation, ...position};  
    return (
      <sg-splitter-side >
        <div ref = {this._getInstance} style = {style}>
          {this.props.children}
        </div>        
      </sg-splitter-side>
    );
  }

  _getInstance(el) {
    this.instance = el;
  }

}

SplitterSide.sgType = 'splitter-side';
export default SplitterSide;