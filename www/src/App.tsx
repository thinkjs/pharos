import * as React from "react";
import { HashRouter, Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Index } from "./pages";
import "./style.less";
// import Login from './pages/login';


// export interface Props {
//   name: string;
//   enthusiasmLevel?: number;
// }

// interface AppProps { }

function App() {
  return (
    <>
      <div>123</div>
      {/* <HashRouter>
        <Switch>
          <Route exact={true} path="/index" component={Index} />
          <Route exact={true} path="/" component={Login} />
        </Switch>
      </HashRouter> */}
    </>
  );
}

export default App;
