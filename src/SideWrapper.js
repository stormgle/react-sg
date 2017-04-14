"use strict"

import React from 'react'

import mq from 'media-query'

import { createAnimStyle } from './lib/animation'
import util from './lib/util'
import log from './lib/log'

import BaseComponent from './BaseComponent'

const DEFAULT_SIDE_WIDTH = '250px';
const DEFAULT_BACKGROUND_COLOR = 'w3-light-grey';

/**
 * SideWrapper Component
 * @extends BaseComponent 
 * */
class SideWrapper extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = { width : null };

    this.childrenProps = {};
    this.instance = null;

    this.bind('_getChildProps', '_genChildren', 
              '_isCollapseAuto', '_isCollapseTrue', '_isCollapsed',
              '_isSideBarShowing', '_onClickOutsideSideBar',
              '_getInstance', 'getWidthReactively'
    );

  }

  componentDidMount() {
    window.addEventListener('resize', this.getWidthReactively, false);
    this.getWidthReactively();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getWidthReactively, false);
  }

  render() {
    const children = this._getChildProps()._genChildren();
    return (
      <sg-side-wrapper>
        <div className = 'side-wrapper' ref = {this._getInstance}>
          {children}
          <div className = 'side-overlay w3-overlay' 
               style = {this._getOverlayStyle()}
               onClick = {this._onClickOutsideSideBar} />
        </div>         
      </sg-side-wrapper>
    );

  }

  _getChildProps() {
    React.Children.forEach(this.props.children, child => {
      if (child.type && child.type.sgType === 'side-bar') {        
        this.childrenProps.sideBar = {
          width: this.formatWidth(child.props.width),
          collapse: child.props.collapse || false,
          side: child.props.side || 'left',
          overlay: child.props.overlay || false,
          isOpen: child.props.isOpen || false,
          onClickOutside: child.props.onClickOutside || null,
          backgroundColor: child.props.backgroundColor || DEFAULT_BACKGROUND_COLOR,
          animation: child.props.animation || 'none',
          animationOptions: child.props.animationOptions || {},
        };
      }
      if (child.type && child.type.sgType === 'side-content') {
        /* if side bar is collapsed, the content with must be re-calculated */
        let width = '100%';
        if (this._isCollapsed()) {
          const screenWidth = this.state.width;
          const barWidth = this.getSideBarWidthInNumber(this.childrenProps.sideBar.width, screenWidth);
          const contentWidth = screenWidth - barWidth;
          width = this.formatWidth(contentWidth);
        }
        this.childrenProps.sideContent = {
          width
        };
      }
    });    
    return this;
  }

  _genChildren() {
    const children = React.Children.map(this.props.children, child => {
      if (child.type && child.type.sgType === 'side-bar') {
        const sideBar = this.childrenProps.sideBar;
        /* process style */
        const style = {...child.props.style};
        // style width
        if (sideBar.width) {
          style.width = sideBar.width;
        }
        // sidebar position
        if (sideBar.side === 'right') {
          style.right = 0;
        }        
        // sidebar show or hide
        if (this._isCollapseTrue()) {
          style.display = 'block';
        } else if (this._isSideBarShowing()) {
          // process animation
          style.display = 'block';
          if (sideBar.animation !== 'none') {
            const animation = sideBar.animation;
            const animationOptions = sideBar.animationOptions;
            const anim = createAnimStyle(animation, animationOptions);
            Object.assign(style,anim);
          }
        } else {
            if (sideBar.animation !== 'none') {
              const animation = sideBar.animation;
              const animationOptions = {...sideBar.animationOptions};
              animationOptions.direction = 'reverse';
              const anim = createAnimStyle(animation, animationOptions);
              Object.assign(style,anim);
              /* display will be set to none after animation end */
            } else {
              style.display = 'none';
            }
        }
        
        /* process class */
        const _baseClass = 'w3-sidebar w3-bar-block';
        let w3class = _baseClass;
        if (this._isCollapseAuto()) {
          w3class = `${_baseClass} w3-collapse`
        }

        // background color can be w3 color name or standard color name or 
        // hex string start by # or rgb, rgba
        // if user input w3 color, we add it to class, otherwise, we add to inline style
        const backgroundColor = sideBar.backgroundColor.trim();
        if (/^w3-/.test(backgroundColor)) {
          w3class = `${w3class} ${backgroundColor}`;
        } else {
          style.backgroundColor = backgroundColor;
        }
        return React.cloneElement(child, {style, w3class});
      }

      if (child.type && child.type.sgType === 'side-content') {
        /* process style */
        const style = {...child.props.style};
        style.width = this.childrenProps.sideContent.width;
        style.position = 'absolute';
        style.height = '100%';
        /* when collapse is auto, w3css will auto adjust margin of w3-main */
        if (this._isCollapseTrue() || this._isCollapseAuto()) {
          if (this.childrenProps.sideBar.side === 'right') {
            style.marginRight = this.childrenProps.sideBar.width;
          } else {
            style.marginLeft = this.childrenProps.sideBar.width;
          }        
        }
        /* process class */
        const w3class = this._isCollapseAuto() ? 'w3-main' : '';
        return React.cloneElement(child, {style, w3class, onClick : this._onClickOutsideSideBar});
      }      
    });

    return children;
  }

  formatWidth(width) {
    if (!width) {
      return DEFAULT_SIDE_WIDTH;
    }

    if (util.isNumber(width)) {
      return `${width}px`;
    }

    if (util.isString(width)) {
      width = width.trim().replace(" ", "");
      if (/(^\d+px$)|(^\d+%$)/i.test(width)) {
        return width
      } else if(util.isNumber(parseInt(width))) {
        return `${parseInt(width)}px`;
      } else {
        log.warn({
          root : 'SideBar', 
          message : 'Invalid value of width',
          detail : `Width should be a number or a string ended with px or %. Use default ${DEFAULT_SIDE_WIDTH}`
        });
        return DEFAULT_SIDE_WIDTH;
      }
    }    
  }

  getSideBarWidthInNumber(barWidth, screenWidth) {
    if (!barWidth) { return 0 }

    if (util.isNumber(barWidth)) {
      return barWidth;
    }

    if (util.isString(barWidth)) {
      /* sidebar width is defined in pixel */
      if (/^\d+px$/i.test(barWidth)) {
        return parseInt(barWidth.replace('px',''));
      }
      /* sidebar width is defined in percentage */
      if (/^\d+%$/i.test(barWidth)) {
        const barWidthInPercentage = parseInt(barWidth.replace('%',''));
        return barWidthInPercentage * parseInt(screenWidth) / 100;
      }
    }

    /* wrong input type */
    return 0;

  }

  _isCollapseAuto() {
    const collapse = this.childrenProps.sideBar.collapse;
    return util.isString(collapse) && collapse.toLowerCase() === 'auto';
  }

  _isCollapseTrue() {
    const collapse = this.childrenProps.sideBar.collapse;
    return collapse === true;
  }

  _isCollapsed() {
    if (this._isCollapseTrue()) {
      return true;
    }
    if (this._isCollapseAuto() && (mq.isLarge() || mq.isxLarge())) {
      return true;
    }
    /* reach here mean collapse is false or auto but small screen */
    return false;
  }

  _isSideBarShowing() {
    return this.childrenProps.sideBar.isOpen === true;
  }

  _getOverlayStyle() {
    const style = {display: 'none', zIndex: 0};
    if (this.childrenProps.sideBar.overlay === true) {
      if (this._isSideBarShowing()) {
        style.display = 'block';
      }
    }
    return style;
  }

  _onClickOutsideSideBar() {
    if (this.childrenProps.sideBar.onClickOutside) {
      this.childrenProps.sideBar.onClickOutside();
    }
  }

  getWidthReactively() {
    if (this.instance) {
      const width = parseInt(this.instance.clientWidth);
      this.setState({ width });
    }  
  }

  _getInstance(el) {
    this.instance = el;
  }


}

SideWrapper.sgType = 'side-wrapper';
export default SideWrapper;