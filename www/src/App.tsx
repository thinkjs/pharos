import * as React from "react";
import { Route, Redirect, Switch } from 'react-router-dom'
import Index from './pages/index'
import Login from './pages/login'
import Register from './pages/register'
import NoMatch from './components/NoMatch'



const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem('isLogin') ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
    }
  />
);

class App extends React.Component {

  render() {
    return (
      <Switch>
        <Redirect exact from="/" to="/index" />
        <AuthRoute path="/index" component={Index} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={NoMatch} />
      </Switch>
    );
  }
}

export default App
