"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Page from '../../dist/Page'
import Navigator from '../../dist/Navigator'

class Demo extends Component {
	
	renderRoute(route, nav) {
		function nextPage() {
			if (route.id === 1) {
				nav.push({ id: 2, name : 'PAGE 2'}, {animation : 'slide-bottom', onPrePush : route => console.log('SPECIAL PUSH')});
			} else if (route.id === 2) {
				nav.push({ id: 3, name : 'PAGE 3'}, {animation : 'none'});
			} else {
				nav.push({ id: route.id + 1, name : `PAGE ${route.id + 1}`});
			}			
		}
		function previousPage() {
			if (route.id === 2) {
				nav.pop({animation :'slide-bottom', onPrePop : route => console.log('SPECIAL POP')});
			} else if (route.id === 3) {
				nav.pop({animation : 'none'});
			} else {
				nav.pop();
			}
		}
		function resetStack() {
			//nav.reset([{id: 0, name : 'PAGE 0'}],{animation :'slide-bottom'});
			//nav.reset([{id: 0, name : 'PAGE 0'}]);
			nav.reset();
		}
		function showPageInfo() {
			console.log(nav.getCurrentRoute());
		}
		function showStackInfo() {
			console.log(nav.getRouteStack());
		}
		return (
			<Page style = {{backgroundColor : colors[route.id]}}
						renderHeader = {() => (<div style = {{backgroundColor : '#f9f9f9'}}> <label className = 'w3-xxlarge'> {route.name} </label></div>)} >
						
				<button onClick = {previousPage}> Back </button>
				<button onClick = {nextPage}> Next </button>
				<button onClick = {resetStack}> Reset </button>
				
				<div>
					<div> <input type = 'checkbox' /> A </div>
					<div> <input type = 'checkbox' /> B </div>
					<div> <input type = 'checkbox' /> C </div>
				</div>
				
				<div>
					<button onClick = {showPageInfo}> Page Info </button>
				</div>
				<div>
					<button onClick = {showStackInfo}> Stack Info </button>
				</div>
				
			</Page>
		);
	}
	
	render() {
		console.log('# Strom-ui Test Program');
		return (
			<Navigator	
				initialRouteStack = {[ {id :0, name : 'PAGE 0'}, {id :1, name : 'PAGE 1'} ]}
				initialRoute = {{id :2, name : 'PAGE 2'}}
				renderRoute = {this.renderRoute.bind(this)}
				animation = 'slide-right'
				animationOptions = {{duration : 500}}
				onPrePush = {(route) => console.log(`${route.name} : push a page`) }
				onPostPush = {() => console.log(`push finish`)}
				onPrePop = {(route) => console.log(`${route.name} : pop back`) }
				onPostPop = {() => console.log(`pop finish`)}
			/>
		);
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
