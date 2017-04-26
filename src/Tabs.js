"use strict"

import React from 'react'
import PropTypes from 'prop-types'

import util from './lib/util'
import log from './lib/log'
import { ANIMATION, createAnimStyle, validateAnimationName } from './lib/animation'
import BaseComponent from './BaseComponent'

const BAR_COLOR = 'w3-light-grey';
const ACTIVE_TAB_COLOR = 'w3-dark-grey';

class Tab extends BaseComponent {

  /**
   * Render a Tabs  
   * @param {Array}           data - define tabs for render. Each item is an object {label, content, side, show}
   * @param {Number}          index - initial tab to be shown after mounted
   * @param {String}          position - position Top or Bottom
   * @param {String}          align - align tab left, right, center or justify
   * @param {Boolean}         barBorder - a border around tab bar
   * @param {String}          barColor - color of Tab bar
   * @param {String}          activeTabColor - color of active tab
   * @param {String}          activeTabBorder - a border around active tab
   * @param {String}          contentBorder - a border around tab content
   * @param {Function}        onPreChange - Call before changin tab
   * @param {Function}        onChange - Call after tab has been changed
   * @param {String}          animation - define animation, support: slide, push
   * @param {Object}          animationOptions - define animation option 
   */
  constructor(props) {
    super(props);

    this.state = {
      width: null,
      tabs: [],
      index: 0,
      lastIndex: 0,
      enterAnimation: null,
      exitAnimation: null,
    };

    this.instance = null;
    this._isAnimationRunning = false;

    this.bind(
      'renderTabBar', 'renderTabContent', 'setActiveTab',
      '_getInstance', 'getWidthReactively',
      'createEnterAnimation', 'createExitAnimation',
    );

  }

  componentWillMount() {
    const index = this.props.index || 0;
    const tabs = this.getTabsData(this.props.data);
    this.setState({tabs, index});
  }

  componentDidMount() {
    window.addEventListener('resize', this.getWidthReactively, false);
    this.getWidthReactively();
  }

  componentWillReceiveProps(nextProps) {
    /* user can force tab change by change prop index
       we detect it by comparing new index with  state.index and previous index
       and update stae.index only if
          - index !== state.index && index !== props.index  
    */
    if (nextProps.index !== this.state.index && 
        nextProps.index !== this.props.index) {  
          this.setActiveTab(nextProps.index);
    }
    
    /* to support dynamic tab, we will capture new data */
    if (nextProps.data !== this.props.data) {
      const tabs = this.getTabsData(nextProps.data);
      this.setState({ tabs });
    }
    
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

    if (this._isAnimationRunning) { return } // prevent run twice

    const lastIndex = this.state.index;

    const direction = lastIndex > index ? 'left' : 'right';
    const enterAnimation = this.createEnterAnimation(0, direction);
    const exitAnimation = this.createExitAnimation(0, direction);

    this.setState ({ index, lastIndex, enterAnimation, exitAnimation });

    /* invoke onChange callback after animation completed */
    if (this.props.onChange) {
      setTimeout(() => {
        this._isAnimationRunning = false;
        this.props.onChange(index, lastIndex);
      }, enterAnimation.to);
    }    

    this._isAnimationRunning = true;
    
  }

  onPreChange(index) {
    if (index === this.state.index) { return }
    if (this._isAnimationRunning) { return } // prevent run twice
    const lastIndex = this.state.index;
    /* invoke onPreChange callback before re-render */
    if (this.props.onPreChange) {
      this.props.onPreChange(lastIndex, index);
    }  
    this.setActiveTab(index);
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
                        onClick = {() => this.onPreChange(index)} >
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
    let baseClass = 'tab-content-box';
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
          let style = index === this.state.index? {display : 'block'} : {display : 'none'};
          if (index === this.state.index) {
            if (this.state.enterAnimation) {
              style = {...style, ...this.state.enterAnimation.animation};
            }
          }
          if (index === this.state.lastIndex) {
            if (this.state.exitAnimation) {
              style = {...style, ...this.state.exitAnimation.animation};
              style.display = 'block';
              style.position = 'absolute';
              style.top = 0;
            }
          }
          return (
            <div className = 'tab-content' key= {index} style = {style} >
              {tab.content}
            </div>
          );
        })}
      </div>
    );
  }

  createEnterAnimation(delay, direction) {
    let anim = this.props.animation;
    const animOptions = this.props.animationOptions;
    
    if (anim && validateAnimationName(anim)) {
      
      if (/push/i.test(anim)) {
        anim = anim.replace('push','slide');      
      }
      
      anim = `${anim}-${direction}`;
      
      const _animOptions = {...animOptions};   
      _animOptions.direction = 'forwards';
      _animOptions.duration = _animOptions.duration || ANIMATION.DEFAULT.DURATION;
      return {
        animation: createAnimStyle(anim, _animOptions),
        to: _animOptions.duration
      };
    } else {
      return { animation: null, to: 0 };
    }
  }

  createExitAnimation(delay, direction) {
    let anim = this.props.animation;
    const animOptions = this.props.animationOptions;

    if (anim === undefined || (util.isString(anim) && anim.toLowerCase() === 'none')) {
      return null;
    }
    
    if (!/push/i.test(anim)) {
      const _animOptions = {...animOptions};
      _animOptions.duration = _animOptions.duration || ANIMATION.DEFAULT.DURATION;
      return {
        animation: createAnimStyle('fade-out', _animOptions),
        to: _animOptions.duration
      };
    }

    if (anim && validateAnimationName(anim)) {
      
      anim = `${anim}-${direction}-100`;      

      const _animOptions = {...animOptions};   
      _animOptions.direction = 'forwards';
      _animOptions.duration = _animOptions.duration || ANIMATION.DEFAULT.DURATION;
      return {
        animation: createAnimStyle(anim, _animOptions),
        to: _animOptions.duration
      };
    } else {
      return null;
    }

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

    const style = {};
    if (this.props.height) {
      style.height = this.props.height;
    }

    return (
      <sg-tabs>
        <div ref = {this._getInstance} style = {style} >
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
  index: PropTypes.number,
  position: PropTypes.oneOf(['top', 'bottom']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  barBorder: PropTypes.string,
  barColor: PropTypes.string,
  contentBorder: PropTypes.string,
  activeTabColor: PropTypes.string,
  activeTabBorder: PropTypes.string,
  onPreChange: PropTypes.func,
  onChange: PropTypes.func,
  animation: PropTypes.string,
  animationOptions: PropTypes.object,
  height: PropTypes.string,
}

Tab.sgType = 'tab';
export default Tab;