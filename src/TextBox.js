"use strict"

import React from 'react'

import BaseComponent from './BaseComponent'
import util from './lib/util'
import log from './lib/log'

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
 * @param {Function}  dataList - function return a list of suggestion
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
    const dataList = this.props.dataList;
    
    if (util.isFunction(dataList)) {
      return dataList(text);
    } 
    
    /* dataList is an array of text */

    const list = dataList;

    if (!(list && list.length > 0)) {
      return '';
    }

    if (text.length === 0) {
      return '';
    }

    const suggestion = this.matchingList(list, text);
console.log(suggestion);
    if (suggestion.length > 0) {
      // return with matching case with user input
      const patt = new RegExp(`^${text}`, 'i');
      const _suggLower = suggestion[0].text.replace(patt, text.toLowerCase());
      const _sugg = _suggLower.replace(patt, text);
      return _sugg;
    } else {
      return '';
    }
  
  }

  matchingList(list, text) {
    const patt = new RegExp(`^${text}`, 'i');

    const filteredList = list.filter(elem => {
      if (util.isString(elem)) {
        return patt.test(elem);
      } else if (util.isObject(elem) && elem.text) {
        return patt.test(elem.text);
      } else {
        log.error({
          root: 'TextBox',
          message: 'Invalid DataList',
          detail: 'The prop DataList must be an array of string or object that content text property'
        });
      }
    });
    
    return filteredList.map((elem, __index) => {
      if (util.isString(elem)) {
        if (patt.test(elem)) {
          return {__index, text: elem};
        }
      } else if (util.isObject(elem) && elem.text) {
        if (patt.test(elem.text)) {
          return {__index, ...elem};
        }
      }
    });
  }

}

TextBox.sgType = 'text-box';
export default TextBox;
