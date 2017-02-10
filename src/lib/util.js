"use strict"

// export function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

"use strict"

const getClass = {}.toString;
let  Util = {};

['Arguments', 'Array', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Object']
.forEach( name => {
  Util[`is${name}`] = function (obj) {
    return obj && getClass.call(obj) == `[object ${name}]`;
  };
});

export default Util;