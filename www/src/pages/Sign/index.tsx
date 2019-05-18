import * as React from "react";
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'mobx-react';
import store from './store';
import SignIn from './Signin';
import SignUp from './Signup';


class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <Switch>
          <Route path="/sign/signin" component={SignIn} />
          <Route path="/sign/signup" component={SignUp} />
        </Switch>
      </Provider>
    );
  }
}

export default App
