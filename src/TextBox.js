"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'

/**
 * TextBox component
 * @extends BaseComponent 
 * Input textbox with label
 * @param {String}    type  - text or password, default is text
 * @param {String}    label - label of the textbox
 * @param {Boolean}   labelBottom - position the label at the bottom of text input ???
 * @param {String}    icon - icon to be display along with label - not yet implemented
 * @param {Boolean}   border - border of text input
 * @param {Boolean}   animate - animate the input
 * @param {String}    placeholder - placeholder of the input 
 * @param {Function}  autocomplete - function return a list of suggestion
 * @param {Boolean}   dev - developing layout feature
 * */
class TextBox extends BaseComponent {
  /**
   * 
   */
  constructor(props) {
    super(props);

    this.state = {text : ''};

    this.bind('suggestAutoComplete');

  }

  render() {
    const label = this.props.label;
    const type = this.props.type || 'text';
    const placeholder = this.props.placeholder || '';

    const _inputStyle = {
      position: 'relative'
    };

    const _labelStyle = {
      
    };

    if (this.props.dev) {
      _inputStyle.display = 'inline-block';
      _labelStyle.display = 'inline-block';
      _labelStyle.padding = '8px';
    }

    const suggestion = this.suggestAutoComplete(this.state.text);
    const _suggestionStyle = {
      position: 'absolute', 
      top: 0, 
      padding: '8px', 
      zIndex: -1,
      color: '#ccc'
    };

    return (
      <div className = '__textbox '>
        <div className = {this.props.dev ? 'w3-cell' : ''} style = {_labelStyle} > 
          <label  > {label} </label> 
        </div>
        <div className = {this.props.dev ? 'w3-cell' : ''} style = {_inputStyle} >
          <label style = {_suggestionStyle} > {suggestion} </label>
          <input  className = 'w3-input' 
                  style = {{backgroundColor: 'rgba(255,255,255, 0)'}}
                  onChange = {e => this.updateText(e.target.value)}
                  type = {type}
                  placeholder = {placeholder}
                  />         
        </div>
      </div>
    );

  }

  updateText(text) {
    this.setState({ text });
  }

  suggestAutoComplete(text) {
    const list = [
      'Brune Waterpass',
      'Elen Whitewalk',
      'Catherin Stormclock',
      'Barce Leona'
    ];

    if (text.length === 0) {
      return '';
    }

    const patt = new RegExp(`^${text}`, 'i');

    const suggestion = list.filter(elem => {
      return patt.test(elem);
    });

    if (suggestion.length > 0) {
      // return with matching case with user input
      const _suggLower = suggestion[0].replace(patt, text.toLowerCase());
      const _sugg = _suggLower.replace(patt, text);
      return _sugg;
    } else {
      return '';
    }
  
  }

}

TextBox.sgType = 'text-box';
export default TextBox;
