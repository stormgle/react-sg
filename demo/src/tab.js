"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import '../../css/w3.css'
import '../../css/storm.css'
import '../../css/animation.css'

import Page from '../../dist/Page'
import Tab from  '../../dist/Tab'

const tabs = [
  {label: 'Tab 1', content: <h4> Tab 1, but index 0 </h4>},
  {label: 'Tab 2', content: <h4> I am Tab 2 </h4>},
  {label: 'Tab 3', content: <h4> The last Tab in Demonstration </h4>},
];

class App extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Page>
        <h3> Tabs Demonstration </h3>
        <Tab data = {tabs}
             initialTabIndex = {1}
             border = {true}
             barColor = 'w3-black'
             activeTabColor = 'w3-red' />
      </Page>
    )
  }

}

render( <App />, document.getElementById('root'));