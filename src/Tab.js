"use strict"

import React from 'react'

import util from './lib/util'
import log from './lib/log'
import BaseComponent from './BaseComponent'

const BAR_COLOR = 'w3-light-grey';
const ACTIVE_TAB_COLOR = 'w3-grey';

class Tab extends BaseComponent {

  /**
   * Render a Tabs  
   * @param {Array}           data - define tabs for render. Each item is an object {label, content, show}
   * @param {Number}          initialTabIndex - initial tab to be shown after mounted
   * @param {String}          position - position Top or Bottom
   * @param {String}          align - align tab label as Left, Right, Center or Justify
   * @param {Boolean}         border - a border around tab 
   * @param {String}          barColor - color of Tab bar
   * @param {String}          activeTabColor - color of active tab
   * @param {Function}        onPreChange - Call before changin tab
   * @param {Function}        onChange - Call after tab has been changed
   * @param {String}          animation - define animation
   * @param {Object}          animationOptions - define animation option 
   */
  constructor(props) {
    super(props);

    this.state = {
      tabs: [],
      index: 0
    };

    this.bind('renderTabBar', 'renderTabContent');

  }

  componentWillMount() {
    const index = this.props.initialTabIndex || 0;
    const tabs = this.getTabsData(this.props.data);
    this.setState({tabs, index});
  }

  /* validate data passing to Tab */
  getTabsData(data) {

    if (!util.isArray(data)) {
      log.error({
        root : 'Tab', 
        message : 'Invalid props',
        detail : 'data must be an Array'
      });
      return [];
    }

    data.forEach(tab => {
      if (!util.isObject(tab) || !tab.content || !tab.label) {
          log.error({
          root : 'Tab', 
          message : 'Invalid data entry',
          detail : 'Each item of the array passing to props data must be an object with content and label keys'
        });
        return [];
      }
    });

    return data;

  }

  setActiveTab(index) {
    this.setState ({ index });
  }

  renderTabBar() {
    const tabs = this.state.tabs;
    
    /* get bar color and apply */
    let   w3class = 'w3-bar w3-blue-grey';
    const style = {};
    const barColor = this.props.barColor || BAR_COLOR;
    if (/^w3-/.test(barColor)) {
      w3class = `${w3class} ${barColor}`;
    } else {
      style.backgroundColor = barColor;
    }

    /* get active tab color */
    const activeTabColor = this.props.activeTabColor || ACTIVE_TAB_COLOR;
    

    return (
      <div className = {w3class} style = {style} >
        {tabs.map((tab, index) => {
          /* apply active tab color if active */
          let btnClass = 'w3-bar-item w3-button';
          const btnStyle = {};
          if (index === this.state.index) {
            if (/^w3-/.test(activeTabColor)) {
              btnClass = `${btnClass} ${activeTabColor}`;
            } else {
              btnStyle.backgroundColor = activeTabColor;
            }
          }
          return (
            <button key = {index} 
                    className = {btnClass} style = {btnStyle}
                    onClick = {() => this.setActiveTab(index)} >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  renderTabContent() {
    const tabs = this.state.tabs;
    return (
      <div className = 'tab-content' >
        {tabs.map((tab, index) => {
          const style = index === this.state.index? {display : 'block'} : {display : 'none'}
          return (
            <div key= {index} style = {style} >
              {tab.content}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const _class = this.props.border ? 'w3-border' : '';
    return (
      <sg-tabs>
        <div className = {_class} >
          {this.renderTabBar()}
          {this.renderTabContent()}
        </div>
      </sg-tabs>
    );
  }

}

Tab.sgType = 'tab';
export default Tab;