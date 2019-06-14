
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App'
import { Router } from 'react-router-dom'
import history from '@utils/history'
import { Provider } from 'mobx-react'
import store from './app.store'

ReactDOM.render(
  <Router history={history}>
    <Provider {...store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root') as HTMLElement
);