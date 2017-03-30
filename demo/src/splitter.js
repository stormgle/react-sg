"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import '../../css/w3.css'
import '../../css/storm.css'
import '../../css/animation.css'

import Splitter from '../../dist/Splitter'
import SplitterSide from '../../dist/SplitterSide'
import SplitterContent from '../../dist/SplitterContent'
import Page from '../../dist/Page'

class Demo extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = { 
			side : 'left',
			isOpenMenu : false, 
			collapse : false,
			lockContent : false,
		};
		
	}
	
	render() {		
		return (

				<Splitter>
					<SplitterSide 
						collapse = {this.state.collapse}
						side = {this.state.side}
						isOpen = {this.state.isOpenMenu}
						shouldLockContent = {this.state.lockContent}
						animation	= 'slide'
						>
						<h3> HEADING 3 </h3>
						<br />
						<button onClick = {this.closeMenu.bind(this)} > close </button>
					</SplitterSide>
					<SplitterContent>
						<Page>
							<div> Content </div>
							<div>
								<button onClick = {this.toggleMenu.bind(this)} style = {{right : 0, position: 'absolute'}} > Menu </button>
							</div>
							<div>
								<button onClick = {this.switchSide.bind(this)}> {this.state.side === 'left' ? 'Left':'Right'} </button>
								<button onClick = {this.toggleCollapse.bind(this)}> {this.state.collapse ? 'Collapse: true':'Collapse: false'} </button>
								<button onClick = {this.toggleLockContent.bind(this)}> {this.state.lockContent ? 'Lock: true':'Lock: false'} </button>
							</div>
						</Page>
					</SplitterContent>
				</Splitter>

		);
	}

	switchSide() {
		const side = this.state.side === 'left' ? 'right' : 'left';
		this.setState({ side });
	}
	
	toggleMenu() {
		this.setState({ isOpenMenu : !this.state.isOpenMenu });
	}

	toggleCollapse() {
		this.setState({ collapse : !this.state.collapse });
	}

	toggleLockContent() {
		this.setState({ lockContent : !this.state.lockContent });
	}
	
	closeMenu() {
		this.setState({ isOpenMenu : false });
	}
}

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Demo />
    );    
  }
}

render( <App />, document.getElementById('root'));
