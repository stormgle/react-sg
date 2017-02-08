"use strict"

export default {
  
  throw({root = '', severity = '', message = '', detail = '' }) {
    message = `StormUI.${root} : ${message}. \n${detail}`;
    if (severity.toLowerCase() === 'error') {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }

}