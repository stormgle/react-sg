"use strict"

import React from 'react'

import mq from 'media-query'

import { createAnimStyle, validateAnimationName } from './lib/animation'
import util from './lib/util'
import log from './lib/log'

import BaseComponent from './BaseComponent'

const DEFAULT_SIDE_WIDTH = '250px';
const DEFAULT_BACKGROUND_COLOR = 'w3-blue-grey';

/**
 * SideWrapper Component
 * @extends BaseComponent 
 * */
class SideWrapper extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = { 
      width : null
    };

    this.childrenProps = {};
    this.instance = null;

    this.bind('_getChildProps', '_genChildren', 
              '_isCollapseAuto', '_isCollapseTrue', '_isCollapsed',
              '_isSideBarOpen', '_onClickOutsideSideBar',
              '_getInstance', 'getWidthReactively',
              'onAnimationEnd', 'onSideBarPropsChange',
              '_applyAnimationToSideBar', '_applyAnimationToSideContent',
              '_lockSideContentDuringAnimation'
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
        /* detect whether side bar is opening or closing. it is useful for
           determining whether we should apply animation
        */     
        let isOpening = false;
        let isClosing = false;
        if (this.childrenProps.sideBar) {
          if (!this.childrenProps.sideBar.isOpen && child.props.isOpen) {
            isOpening = true;
          }
          if (this.childrenProps.sideBar.isOpen && !child.props.isOpen) {
            isClosing = true;
          }
        }

        this.childrenProps.sideBar = {
          isOpening, isClosing,
          width: this.formatWidth(child.props.width),
          collapse: child.props.collapse || false,
          side: child.props.side || 'left',
          overlay: child.props.overlay || false,
          isOpen: child.props.isOpen || false,
          onClickOutside: child.props.onClickOutside || null,
          backgroundColor: child.props.backgroundColor || DEFAULT_BACKGROUND_COLOR,
          border: child.props.border || false,
          card: child.props.card || '',
          animation: child.props.animation || 'none',
          animationOptions: child.props.animationOptions || {},
          onPreOpen: child.props.onPreOpen || function(){},
          onOpen: child.props.onOpen || function(){},
          onPreClose: child.props.onPreClose || function(){},
          onClose: child.props.onClose || function(){}
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
        // sidebar show or hide with animation 
        this._applyAnimationToSideBar(style);

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
        /* border */
        if (sideBar.border) {
          w3class = `${w3class} w3-border`;
        }
        /* card */
        w3class = `${w3class} w3-${sideBar.card}`;
        return React.cloneElement(child, {
          style, 
          w3class, 
          onAnimationEnd: this.onAnimationEnd,
          onSideBarPropsChange: this.onSideBarPropsChange,
        });
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
        /* apply animation */
        this._applyAnimationToSideContent(style);
        this._lockSideContentDuringAnimation(style);    
        /* process class */
        const w3class = this._isCollapseAuto() ? 'w3-main' : '';
        return React.cloneElement(child, {
          style, 
          w3class, 
          onClick : this._onClickOutsideSideBar
        });
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

  getSideBarWidthInPercentage(barWidth, screenWidth) {
    if (!barWidth) { return 0 }

    if (util.isNumber(barWidth)) {
      return parseInt((barWidth*100)/screenWidth);
    }

    if (util.isString(barWidth)) {
      if (/^\d+px$/i.test(barWidth)) {
        const barWidthInNumber = parseInt(barWidth.replace('px',''));
        return parseInt((barWidthInNumber*100)/screenWidth);
      }
      if (/^\d+%$/i.test(barWidth)) {
        return parseInt(barWidth.replace('%',''));;
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

  _isSideBarOpen() {
    return this.childrenProps.sideBar.isOpen === true;
  }

  _getOverlayStyle() {
    const style = {display: 'none', zIndex: 0};
    if (this.childrenProps.sideBar.overlay === true) {
      if (this._isSideBarOpen()) {
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

  _getSideBarAnimation(sideBar, direction) {

    let animation = sideBar.animation.trim();

    if (/pushpull/i.test(animation)) {
      animation = animation.replace('pushpull','slide');
    }

    if (/push/i.test(animation)) {
      animation = animation.replace('push','slide');
    }

    if (!/(-left$)|(-right$)/i.test(animation)) {
      animation = `${animation}-${sideBar.side.toLowerCase()}`;
    }

    const animationOptions = {...sideBar.animationOptions};
    if (direction) {
      animationOptions.direction = direction;
    }   

    return createAnimStyle(animation, animationOptions);

  }

  _getSideContentAnimation(sideBar, direction) {

    let animation = sideBar.animation.trim();

    if (/slide/i.test(animation)) {
      return null;
    }

    if (/pushpull/i.test(animation)) {
      /* process later */
    }

    /* reach here, animation will be push */

    if (!/(-left$)|(-right$)/i.test(animation)) {
      animation = `${animation}-${sideBar.side.toLowerCase()}`;
    }
    const screenWidth = this.state.width;
    const deviation = this.getSideBarWidthInPercentage(sideBar.width, screenWidth);
    animation = `${animation}-${deviation}`;
    
    const animationOptions = {...sideBar.animationOptions};
    if (direction) {
      animationOptions.direction = direction;
    }   

    return createAnimStyle(animation, animationOptions);

  }

  _applyAnimationToSideBar(style) {
    const sideBar = this.childrenProps.sideBar;
    if (this._isCollapseTrue()) {
      style.display = 'block';
    } else if (!this._isCollapsed()) {
      if (sideBar.isOpening) {
        // process animation
        style.display = 'block';
        if (validateAnimationName(sideBar.animation)) {
          const anim = this._getSideBarAnimation(sideBar, 'forwards');
          Object.assign(style,anim);
        }
      } else if (sideBar.isClosing) {
        if (validateAnimationName(sideBar.animation)) {
          style.display = 'block'; // to let animation happen
          const anim = this._getSideBarAnimation(sideBar, 'reverse');
          Object.assign(style,anim);
        } else {
          style.display = 'none';
        }
      } else { // in case not changing open/close state
        if (this._isSideBarOpen()) {
          style.display = 'block';
        } else {
          style.display = 'none';
        }
      }
    }
  }

  _applyAnimationToSideContent(style) {
    if (!this._isCollapsed()) {
      const sideBar = this.childrenProps.sideBar;
      if (sideBar.isOpening) {
        // process animation
        if (validateAnimationName(sideBar.animation)) {
          const anim = this._getSideContentAnimation(sideBar, 'forwards');
          Object.assign(style,anim);
        }
      } else if (sideBar.isClosing) {
        if (validateAnimationName(sideBar.animation)) {
          const anim = this._getSideContentAnimation(sideBar, 'reverse');
          Object.assign(style,anim);
        }
      } else {
        /* we need to maintain the translated position after animation has
            removed. */
        if (/(push)|(pushpull)/i.test(sideBar.animation) && 
            this._isSideBarOpen()) {
          // apply translate depending on side bar side left or right &
          // side bar width (in percentage)  
          const screenWidth = this.state.width;
          const minus = sideBar.side.toLowerCase() === 'right'? '-' : '';
          const deviation = this.getSideBarWidthInPercentage(sideBar.width, screenWidth);
          style.transform = `translateX(${minus}${deviation}%)`;
        }   
      }        
    }
  }

  _lockSideContentDuringAnimation(style) {
    const sideBar = this.childrenProps.sideBar;
    if (sideBar.isOpening || sideBar.isClosing) {
      style.pointerEvents = 'none';
    }
  }

  onAnimationEnd() {
    // forced re-render to update display after animation finished
    this.setState({});
    /* invode sideBar onOpen/onClose callback */
    const sideBar = this.childrenProps.sideBar;
    if (this._isSideBarOpen()) {
      sideBar.onOpen();
    } else {
      sideBar.onClose();
    }

  }

  onSideBarPropsChange(oldProps, newProps) {
    /*  invoke sideBar preOpen/preClose callback before render */
    const sideBar = this.childrenProps.sideBar;
    if (!oldProps.isOpen && newProps.isOpen) {
      sideBar.onPreOpen();
    }
    if (oldProps.isOpen && !newProps.isOpen) {
      sideBar.onPreClose();
    }

  }

}

SideWrapper.sgType = 'side-wrapper';
export default SideWrapper;