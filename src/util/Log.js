"use strict"

export default {

  info({root = '', message = '', detail = ''}) {
    this.throw({severity : 'info', root, message, detail});
  },

  warn({root = '', message = '', detail = ''}) {
    this.throw({severity : 'warning', root, message, detail});
  },

  error({root = '', message = '', detail = ''}) {
    this.throw({severity : 'error', root, message, detail});
  },
  
  throw({root = '', severity = '', message = '', detail = ''}) {
    message = `StormUI.${root} : ${message}. \n${detail}`;
    if (severity.toLowerCase() === 'error') {
      throw new Error(message);
    } else if (severity.toLowerCase() === 'warning') {
      console.warn(message);
    } else {
      console.info(message);
    }
  }

}