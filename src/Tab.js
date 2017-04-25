"use strict"

import React from 'react'
import PropTypes from 'prop-types'

import util from './lib/util'
import log from './lib/log'
import BaseComponent from './BaseComponent'

const BAR_COLOR = 'w3-light-grey';
const ACTIVE_TAB_COLOR = 'w3-dark-grey';

class Tab extends BaseComponent {

  /**
   * Render a Tabs  
   * @param {Array}           data - define tabs for render. Each item is an object {label, content, side, show}
   * @param {Number}          initialTabIndex - initial tab to be shown after mounted
   * @param {String}          position - position Top or Bottom
   * @param {String}          align - align tab left, right, center or justify
   * @param {Boolean}         barBorder - a border around tab bar
   * @param {String}          barColor - color of Tab bar
   * @param {String}          activeTabColor - color of active tab
   * @param {String}          activeTabBorder - a border around active tab
   * @param {String}          contentBorder - a border around tab content
   * @param {Function}        onPreChange - Call before changin tab
   * @param {Function}        onChange - Call after tab has been changed
   * @param {String}          animation - define animation
   * @param {Object}          animationOptions - define animation option 
   */
  constructor(props) {
    super(props);

    this.state = {
      width: null,
      tabs: [],
      index: 0
    };

    this.instance = null

    this.bind(
      'renderTabBar', 'renderTabContent',
      '_getInstance', 'getWidthReactively'
    );

  }

  componentWillMount() {
    const index = this.props.initialTabIndex || 0;
    const tabs = this.getTabsData(this.props.data);
    this.setState({tabs, index});
  }

  componentDidMount() {
    window.addEventListener('resize', this.getWidthReactively, false);
    this.getWidthReactively();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getWidthReactively, false);
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

    /* get bar border */
    if (this.props.barBorder) {
      const barBorder = this.props.barBorder;
      if (/^w3-/.test(barBorder)) {
        w3class = `${w3class} ${barBorder}`;
      } else {
        style.border = barBorder;
      }
    }

    /* get active tab color & border */
    const activeTabColor = this.props.activeTabColor || ACTIVE_TAB_COLOR;
    const activeTabBorder = this.props.activeTabBorder || null;
    
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
    let btnWidth = null;
    if (this.props.align) {
      if (this.props.align.toLowerCase() === 'center') {
        wrapStyle.float = 'right';
        wrapStyle.left = '-50%';
        childStyle.left = '50%';
      } else if (this.props.align.toLowerCase() === 'right') {
        wrapStyle.float = 'right';
        wrapStyle.left = '0';
        childStyle.left = '0';
      } else if (this.props.align.toLowerCase() === 'justify') {
        if (this.state.width) {
          btnWidth = `${this.state.width / tabs.length}px`;
        }
      }
    }
    return (
      <div className = {w3class} style = {style} >
        <div style = {wrapStyle}>
          <div style = {childStyle} >
            {tabs.map((tab, index) => {          
              let btnClass = 'w3-bar-item w3-button';
              const btnStyle = {width: btnWidth};
              /* apply active tab color & border if active */
              if (index === this.state.index) {
                if (/^w3-/.test(activeTabColor)) {
                  btnClass = `${btnClass} ${activeTabColor}`;
                } else {
                  btnStyle.backgroundColor = activeTabColor;
                }
                if (activeTabBorder) {
                  if (/^w3-/.test(activeTabBorder)) {
                    btnClass = `${btnClass} ${activeTabBorder}`;
                  } else {
                    btnStyle.border = activeTabBorder
                  }
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
    let baseClass = 'tab-content';
    /* get bar border */
    if (this.props.contentBorder) {
      const contentBorder = this.props.contentBorder;
      if (/^w3-/.test(contentBorder)) {
        baseClass = `${baseClass} ${contentBorder}`;
      } else {
        style.border = contentBorder;
      }
    }
    return (
      <div className = {baseClass} >
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
        <div ref = {this._getInstance}>
          {TopComponent}
          {BottomComponent}
        </div>
      </sg-tabs>
    );
  }

  getWidthReactively() {
    if (this.instance) {
      /* only re-calculate width and do re-render if align justify */
      if (this.props.align && this.props.align.toLowerCase() === 'justify') {
        const width = parseInt(this.instance.clientWidth);
        this.setState({ width });
      }
    }  
  }

  _getInstance(el) {
    this.instance = el;
  }

}

Tab.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialTabIndex: PropTypes.number,
  position: PropTypes.oneOf(['top', 'bottom']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  barBorder: PropTypes.string,
  barColor: PropTypes.string,
  contentBorder: PropTypes.string,
  activeTabColor: PropTypes.string
}

Tab.sgType = 'tab';
export default Tab;