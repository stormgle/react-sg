"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

/**
 * Page component
 * @extends BaseComponent 
 * */
export default class extends BaseComponent {
  /**
   * Render a Page component
   * @param {function} renderHeader - render Header of Page
   * @param {function} renderFooter - renderFooter of Page
   * @param {function} renderFixed - render a fixed component on Page
   * @param {function} renderModal - render a model cover entire of Page
   * @param {boolean} hideHeader - hide page header behind background
   * @param {boolean} hideFooter - hide page footer behind background
   * @param {boolean} hideModal - hide modal behind background
   * @param {string} modifier - specify modifier style for Page
   * @param {function} onInit - function will be invoked after Page is mounted
   * @param {function} onShow - function will be invoked after page has been shown
   * @param {function} onHide - function will be invoked after page has been hide
   */
  constructor(props) {
    super(props);
  }

  parseModifier() {
    return ''; // implement later
  }

  render() {
    const style = 'w3';
    const header = this.props.renderHeader ? this.props.renderHeader() : null;
    const footer = this.props.renderFooter ? this.props.renderFooter() : null;
    const fixed  = this.props.renderFixed ? this.props.renderFixed() : null;
    const model  = this.props.renderModal ? this.props.renderModal() : null;
    return(
      <sg-page > 
        <div className = 'page'>
          <div className = 'page_background' />
          <div className = {`page_model ${style}-container ${this.props.hideModal ? 'hide' : ''}`} > 
            {model} 
          </div>
          <div className = {`page_header ${style}-container`} > 
            {header} 
          </div>
          <div className = {`page_content ${style}-container`} >
            {this.props.children}
          </div>
          <div className = {`page_footer ${style}-container`}> 
            {footer} 
          </div>
        </div>
      </sg-page>
    );
  }

}
