"use strict"

import React from 'react'
import PropTypes from 'prop-types'

import BaseComponent from './BaseComponent'

class Popup extends BaseComponent {
  constructor(props) {
    super(props);

    this.popup = {

    };

  }

  componentWillMount() {
    if (this.props.page) {
      this.popup.parent = this.props.page; 
    }

    if (this.props.resolve) {
      this.popup.resolve = (...args) => {
        if (this.popup.parent) {
          this.popup.parent.closePopup();
        }
        this.props.resolve(...args);
      }
    }

    if (this.props.reject) {
      this.popup.reject = (...args) => {
        if (this.popup.parent) {
          this.popup.parent.closePopup();
        }
        this.props.reject(...args);
      }
    }

    if (this.props.onInit) {
      this.props.onInit(this.popup);
    }
  }


  render() {
    return (
      <div className = "__page_popup" >
        <div className = "__page_popup_floater" />
        <div className = "__page_popup_child w3-card-4">
          {this.props.children}
        </div>
      </div>
    );
  }

}

Popup.PropTypes = {
  page: PropTypes.object,
  resolve: PropTypes.func,
  reject: PropTypes.func,
  onInit: PropTypes.func
};

Popup.sgType = 'popup';
export default Popup;