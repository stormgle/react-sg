"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

/**
 * SideContent Component
 * @extends BaseComponent 
 * */
class SideContent extends BaseComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const style = this.props.style;
    const w3class = this.props.w3class;   
    return (
      <sg-side-content>
         <div className = {w3class} style = {style} >
           {this.props.children}           
        </div>
      </sg-side-content>
    )
  }

}

SideContent.sgType = 'side-content';
export default SideContent;