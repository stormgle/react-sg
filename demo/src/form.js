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

  renderMatchedList(list, text, selectText) {
    return(
      <div>
        <ul>
          {
            list.map(item => {
              return (
                <li key={item.__index} onClick={() => selectText(item.text)}> {item.text} </li>
              )
            })
          }
        </ul>
      </div>
    )
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
            //renderMatchedList = {this.renderMatchedList}
          />
          <label>
            Example of Form and Textbox
          </label>
        </View>
      </Page>
    );
  }

}


render( <App />, document.getElementById('root'));
