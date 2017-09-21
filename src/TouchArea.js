"use strict"

import React, { Component } from 'react'

import Hammer from './lib/third_parties/hammer'

const events = [
	'Tap', 'DoubleTap',
	'Pan', 'PanStart', 'PanMove', 'PanEnd', 'PanCancel', 'PanLeft', 'PanRight', 'PanUp', 'PanDown',
	'Pinch', 'PinchStart', 'PinchMove', 'PinchEnd', 'PinchCancel', 'PinchIn', 'PinchOut',	
  'Press', 'PressUp',
	'Rotate', 'RotateStart', 'RotateMove', 'RotateEnd', 'RotateCancel',
	'Swipe', 'SwipeLeft', 'SwipeRight', 'SwipeUp', 'SwipeDown',
];

export default class TouchArea extends Component {
	constructor(props) {
		super(props);
		
		this.domEl = null;
		this.hammerTime = null;
		
		this.getInstant = this.getInstant.bind(this);
		
	}
	
	componentDidMount() {
		/* create a hammer instance and bind events */
		this.hammerTime = new Hammer(this.domEl, this.props.options);
		events.forEach( e => {
			const evt = `on${e}`;
			if (this.props[evt]) {								
				this.hammerTime.on(e.toLowerCase(), this.props[evt]);
			}
		});		
		console.log(this.domEl);		
	}
	
	render() {
		return (
			<div ref = {this.getInstant} style = {{backgroundColor: 'yellow'}}>
				{this.props.children}
			</div>
		);
	}
	
	getInstant(el) {
		this.domEl = el;
	}
	
}