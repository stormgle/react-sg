"use strict"

import { isNumber } from './util'

export function createAnimStyle({
  name = '', 
  duration = 2000,
  timing = 'ease', 
  delay = 0, 
  iteration = 1, 
  direction = 'forwards',  
}) {

  if (name.length === 0) {
    log.error({
      root : 'Navigator', 
      message : 'Missing animation name',
      detail : 'An animation name must be specified to use animation'
    });
  }

  if (!isNumber(duration) || duration < 0) {
    log.error({
      root : 'Navigator', 
      message : 'Invalid animation duration value',
      detail : 'Animation diration value must not be a negative number'
    });
  }

  // format options
  duration = `${duration/1000}s`; // convert from number of milliseconds to seconds
  delay = isNumber(delay) && delay > 0 ? `${delay/1000}s` : '';
  iteration = (isNumber(iteration) && iteration > 0) || iteration === 'infinite' ? iteration : '';

  const animation = `${name} ${duration} ${timing} ${delay} ${iteration} ${direction}`
    .trim().replace(/ +/g,' ');

  return {
    'WebkitAnimation': animation,
    'animation': animation,
  };
}