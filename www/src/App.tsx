import * as React from "react";
import { HashRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/login';
import { PageB } from './pages/PageB';


// export interface Props {
//   name: string;
//   enthusiasmLevel?: number;
// }

// interface AppProps { }

function App() {
  return (
    <>
      <HashRouter>
        <Switch>
          <Route exact={true} path="/" component={Login} />
          <Route path="/pageB" component={PageB} />
        </Switch>
      </HashRouter>
    </>
  );
}

export default App;
