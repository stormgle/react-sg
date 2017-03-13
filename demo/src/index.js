"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import '../../css/w3.css'
import '../../css/storm.css'
import '../../css/animation.css'

import Page from './page'

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Page />
    );    
  }
}

console.log ('App Demo Program')
render( <App />, document.getElementById('root'));