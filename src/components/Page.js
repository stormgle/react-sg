"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

export default class extends BaseComponent {
  
  constructor(props) {
    super(props);
  }

  parseModifier() {
    return ''; // implement later
  }

  render() {
    return(
      <sg-page >
      </sg-page>
    );
  }

}
