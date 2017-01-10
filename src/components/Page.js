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
   * @param {function} renderModel - render a model cover entire of Page
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
    const themeContainer = 'w3-container';
    const header = this.props.renderHeader ? this.props.renderHeader() : null;
    const footer = this.props.renderFooter ? this.props.renderFooter() : null;
    const fixed  = this.props.renderFixed ? this.props.renderFixed() : null;
    const model  = this.props.renderModel ? this.props.renderModel() : null;
    return(
      <sg-page > 
        <div className = 'page'>
          <div className = 'page_background' />
          <div className = {`page_model ${themeContainer}`} > 
            {model} 
          </div>
          <div className = {`page_header ${themeContainer}`} > 
            {header} 
          </div>
          <div className = {`page_content ${themeContainer}`} >
            {this.props.children}
          </div>
          <div className = {`page_footer ${themeContainer}`}> 
            {footer} 
          </div>
        </div>
      </sg-page>
    );
  }

}
