
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import App from './App';
import AppRoute from './AppRoute'
import { Router } from 'react-router-dom'
import history from './config/history'

ReactDOM.render(
  // <App history={history} />,
  <Router history={history}>
    <AppRoute />
  </Router>,
  document.getElementById('root')
);