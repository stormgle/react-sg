/* Deprecated */
"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

/**
 * SplitterContent component
 * @extends BaseComponent 
 * */
class SplitterContent extends BaseComponent {

  render() {  
    return (
      <sg-splitter-content style = {{...this.props.style}}>
        {this.props.children}
      </sg-splitter-content>
    );
  }

}

SplitterContent.sgType = 'splitter-content';
export default SplitterContent;