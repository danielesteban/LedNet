import React from 'react';
import {render} from 'react-dom';
import {IndexRoute, Router, Route, Redirect, useRouterHistory} from 'react-router';
import {createHistory} from 'history';
import App from 'App';
import LedNet from 'LedNet';

/* Mount the app */
const mount = document.createElement('mount');
document.body.appendChild(mount);
render((
	<Router history={useRouterHistory(createHistory)({basename: BASENAME})}>
		<Route path="/" component={App}>
			<IndexRoute component={LedNet}/>
			<Redirect from="*" to="/" />
		</Route>
	</Router>
), mount);
