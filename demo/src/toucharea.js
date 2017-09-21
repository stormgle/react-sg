"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Page from '../../dist/Page'
import TouchArea from '../../dist/TouchArea'

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <TouchArea
          onTap = {() => console.log('tap')}
          onDoubleTap = {() => console.log('double tap')}
          onPanStart = {(evt) => {console.log('pan start'); console.log (evt)}}
          onPanEnd = {(evt) => {console.log('pan end'); console.log (evt)}}
          onSwipeLeft = {(evt) => {console.log('swipe left'); console.log (evt)}}
          onSwipeRight = {(evt) => {console.log('swipe right'); console.log (evt)}}
        >
          <div  style = {{width: '400px', height: '400px'}} >
            Touch Area
          </div>
        </TouchArea>
      </Page>
    );    
  }
}


render( <App />, document.getElementById('root'));