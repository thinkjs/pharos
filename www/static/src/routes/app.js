import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
import Layout from '../components/Layout';
import './app.less';

const App = ({children, dispatch, app, location}) => {
  console.log(children)
  return (
    <div>
      <Layout children={children} />
    </div>
  )
};

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
};

export default connect(({app, loading}) => ({app, loading}))(App)
