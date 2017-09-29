"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

/**
 * View component
 * @extends BaseComponent 
 * */
class View extends BaseComponent {
  /**
   * 
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className = 'w3-container'>
        {this.props.children}
      </div>
    );
  }
}

View.sgType = 'view';
export default View;