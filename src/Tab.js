"use strict"

import React from 'react'
import PropTypes from 'prop-types'

import util from './lib/util'
import log from './lib/log'
import BaseComponent from './BaseComponent'

const BAR_COLOR = 'w3-light-grey';
const ACTIVE_TAB_COLOR = 'w3-grey';

class Tab extends BaseComponent {

  /**
   * Render a Tabs  
   * @param {Array}           data - define tabs for render. Each item is an object {label, content, side, show}
   * @param {Number}          initialTabIndex - initial tab to be shown after mounted
   * @param {String}          position - position Top or Bottom
   * @param {String}          align - align tab left, right or center
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
    if (index === this.state.index) { return }
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
    
    /* align tab bar left, right, center */
    const wrapStyle = {
      float: 'none',
      left: '0',
      position: 'relative',
      textAlign: 'left'
    };
    const childStyle = {
      left: '0',
      position: 'relative'
    };
    if (this.props.align) {
      if (this.props.align.toLowerCase() === 'center') {
        wrapStyle.float = 'right';
        wrapStyle.left = '-50%';
        childStyle.left = '50%';
      } else if (this.props.align.toLowerCase() === 'right') {
        wrapStyle.float = 'right';
        wrapStyle.left = '0';
        childStyle.left = '0';
      }
    }
    return (
      <div className = {w3class} style = {style} >
        <div style = {wrapStyle}>
          <div style = {childStyle} >
            {tabs.map((tab, index) => {          
              let btnClass = 'w3-bar-item w3-button';
              const btnStyle = {};
              /* apply active tab color if active */
              if (index === this.state.index) {
                if (/^w3-/.test(activeTabColor)) {
                  btnClass = `${btnClass} ${activeTabColor}`;
                } else {
                  btnStyle.backgroundColor = activeTabColor;
                }
              }
              /* align button to right if specified, only effective if tab align is left */
              if (tab.side && tab.side.toLowerCase() === 'right') {
                btnClass = `${btnClass} w3-right`;
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
        </div>
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

    let TopComponent = null;
    let BottomComponent = null;
    if (this.props.position && this.props.position.toLowerCase() === 'bottom') {
      // render tabbar at top
      TopComponent = this.renderTabContent();
      BottomComponent = this.renderTabBar();
    } else {
      // render tabbar at bottom
      TopComponent = this.renderTabBar();
      BottomComponent = this.renderTabContent();
      
    }

    return (
      <sg-tabs>
        <div className = {_class} >
          {TopComponent}
          {BottomComponent}
        </div>
      </sg-tabs>
    );
  }

}

Tab.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialTabIndex: PropTypes.number,
  position: PropTypes.oneOf(['top', 'bottom']),

  border: PropTypes.bool,
  barColor: PropTypes.string,
  activeTabColor: PropTypes.string
}

Tab.sgType = 'tab';
export default Tab;