import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
import Layout from '../components/Layout';
import NProgress from 'nprogress'
import './app.less';

let lastHref;
const App = ({children, dispatch, app, location, loading}) => {

  const {user,sites,currentSite}  = app;
  const href = window.location.href;
  if (lastHref !== href) {
    NProgress.start();
    if (!loading.global) {
      NProgress.done();
      lastHref = href
    }
  }

  if (location.pathname === '/login' || location.pathname === '/register') {
    return children
  } else {
    const data = {
      user:{
        ...user,
        logout:()=> {
          dispatch({
            type: 'app/logout'
          })
        }
      },
      site:{
        sites,
        currentSite,
        onChange:(val)=>{
          dispatch({
            type:'app/changeSite',
            payload:val
          })
        }
      }
    }
    return (
      <div>
        <Layout children={children} data={data}/>
      </div>
    )
  }
};

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
};

export default connect(({app, loading}) => ({app, loading}))(App)
