"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import '../../css/w3.css'
import '../../css/storm.css'
import '../../css/animation.css'

import Page from '../../dist/Page'

let i = 0;
class Demo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showHeader : true,
			showFooter : true,
		}

		this.page = null;

	}

	renderHeader() {
		if (this.state.showHeader) {
			return (
				<div className = 'w3-banner w3-blue'>
					Page Header
				</div>
			);
		} else {
			return null;
		}
	}

	renderFooter() {
		if (this.state.showFooter) {
			return (
				<div className = 'w3-banner w3-grey' >
					Page Footer
				</div>
			);
		} else {
			return null;
		}
	}

	renderModal(page) {
		return (
			<div>
				<h3> Modal </h3>
				<br />
				<button onClick = {page.hideModal}> Close </button>
			</div>
		);
	}

	toggleHeader() {
		this.setState({ showHeader : !this.state.showHeader});
	}

	toggleFooter() {
		this.setState({ showFooter : !this.state.showFooter});
	}

	showModal () {
		if (this.page) {
			this.page.showModal();
		}
	}
	
	pushOverlay () {
		if (this.page) {
			i++;
			this.page.pushOverlay(
				<div>
					<h2> Overlay {i} </h2>
					<button onClick = {this.page.popOverlay}>Close</button>
					<button onClick = {this.pushOverlay.bind(this)}>More...</button>
				</div>
			)
		}
	}

	render() {

		return (
			<Page onInit = {page => this.page = page}
						renderHeader = {this.renderHeader.bind(this)}
						renderFooter = {this.renderFooter.bind(this)}
						renderModal  = {this.renderModal.bind(this)} >
				
				<div>
					<button onClick = {() => this.toggleHeader()}>
						{this.state.showHeader ? 'hide' : 'show'}  header 
					</button>
					<button onClick = {() => this.toggleFooter()}>
						{this.state.showFooter ? 'hide' : 'show'}  footer 
					</button>
				</div>

				<div>
					<button onClick = {() => this.showModal()}> Modal </button>
					<button onClick = {() => this.pushOverlay()}> Overlay </button>
				</div>

			</Page>
		)
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