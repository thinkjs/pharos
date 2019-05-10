
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import App from './App';
import App from './App'
import { Router } from 'react-router-dom'
import history from './components/history'

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root')
);