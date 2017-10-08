import React from 'react';
import { Router } from 'dva/router';
import PropTypes from 'prop-types'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

function Routers({ history, app }) {
  const routes = [
    {
      path:'/',
      component:App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        },
        {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/login'));
              registerModel(app, require('./models/app'));
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        },
        {
          path: 'register',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/login'));
              registerModel(app, require('./models/app'));
              cb(null, require('./routes/register/'))
            }, 'register')
          },
        },
      ]
    }
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers;
