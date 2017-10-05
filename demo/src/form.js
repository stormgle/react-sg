"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import '../../css/third_parties/w3.css'
import '../../css/storm.css'
import '../../css/animation.css'

import Page from '../../dist/Page'
import View from '../../dist/View'
import TextBox from '../../dist/TextBox'

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page >
        <View>
          <TextBox 
            label = 'Display name'
            placeholder = 'J.Doe'
            border
            dataList = {['Bennie Wolf', 'Alex Rice', 'Jon White', 'Bradon Brown']}
            /*
            dataList = {[
              {text: 'Bennie Wolf'}, 
              {text: 'Alex Rice'}, 
              {text: 'Jon White'}, 
              {text: 'Bradon Brown'}
            ]}
            */
          />
        </View>
      </Page>
    );
  }

}


render( <App />, document.getElementById('root'));
