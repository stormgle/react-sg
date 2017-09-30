"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

/**
 * TextBox component
 * @extends BaseComponent 
 * Input textbox with label
 * @param {String}  type  - text or password, default is text
 * @param {String}  label - label of the textbox
 * @param {Boolean} labelBottom - position the label at the bottom of text input ???
 * @param {String}  icon - icon to be display along with label - not yet implemented
 * @param {Boolean} border - border of text input
 * @param {Boolean} animate - animate the input
 * @param {String}  placeholder - placeholder of the input 
 * @param {Function}  autocomplete - function return a list of suggestion
 * */
class TextBox extends BaseComponent {
  /**
   * 
   */
  constructor(props) {
    super(props);
  }

  render() {
    const label = this.props.label;
    const type = this.props.type || 'text';
    const placeholder = this.props.placeholder || '';

    const _inputStyle = {
      display: 'inline-block',
      borderTop: '1px solid #ccc',
      borderRight: '1px solid #ccc',
//      borderLeft: '1px solid #ccc',
    };

    const _labelStyle = {
      display: 'inline-block',
      padding: '8px',
      borderTop: '1px solid #ccc',
      borderLeft: '1px solid #ccc',
      borderRight: '1px solid #ccc',
      borderBottom: '1px solid #ccc',
    }

    return (
      <div className = '__textbox w3-cell-row'>
        <div className = 'w3-cell' style = {_labelStyle} > 
          <label  > {label} </label> 
        </div>
        <div className = 'w3-cell' style = {_inputStyle} >
        <input  className = 'w3-input' 
                type = {type}
                placeholder = {placeholder}
                 />
        </div>
      </div>
    );
  }
}

TextBox.sgType = 'text-box';
export default TextBox;
