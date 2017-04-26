"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import '../../css/third_parties/w3.css'
import '../../css/storm.css'
import '../../css/animation.css'

import Page from '../../dist/Page'
import Tabs from  '../../dist/Tabs'

const dict = {
  Hanoi: 'Vietnam',
  London: 'England',
  Tokyo: 'Japan'
};

function renderCity(city) {
  return {
    label : city,
    content: (
      <div className = 'w3-container'>
        <h3> {city} </h3>
        <div>
          {city} is the captital of {dict[city]}
        </div>
        <div style = {{marginTop: '30px'}} />
      </div>
    )
  };
} 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: Object.keys(dict).map(city => renderCity(city)),
      index: 0,
    };
  }

  getCity(city) {
    this.city = city;
  }

  getCountry(country) {
    this.country = country;
  }

  addNewTab() {
    if (this.city && this.country) {
      dict[this.city] = this.country;
      const tabs = Object.keys(dict).map(city => renderCity(city));
      this.setState({ tabs });
    }
  }

  moveToTab(index) {
    this.setState({ index });
  }

  render() {
    return (
      <Page>
        <h3> Tabs Demonstration </h3>
        <div style = {{marginBottom: '20px'}}>
          <input type = 'text' placeholder = 'City' onChange = {evt => this.getCity(evt.target.value)} />
          <input type = 'text' placeholder = 'Country' onChange = {evt => this.getCountry(evt.target.value)} />
          <button onClick = {this.addNewTab.bind(this)}> Add New Tab </button>
        </div>
        <div style = {{marginBottom: '20px'}} >
          {this.state.tabs.map((tab,index) => (
            <button key={index} onClick = {e => this.moveToTab(index)} style = {{width: '30px', marginRight: '5px'}}>
              {`${index}`}
            </button>
          ))}
        </div>
        <Tabs data = {this.state.tabs}
             index = {this.state.index}
             barBorder = 'w3-border-bottom w3-border-grey'
             barColor = 'w3-black'
             activeTabColor = 'w3-red'
             contentBorder = 'w3-border-bottom w3-border-grey'
             position = 'top'
             align = 'justify'
             animation = 'push'
             animationOptions = {{duration: 1000}}
             onPreChange = {(current, next) => {console.log('pre-change'); }}
             onChange = {(current, last) => {console.log(`changed`); this.moveToTab(current)}}
             height = '70%' />
      </Page>
    )
  }

}

render( <App />, document.getElementById('root'));