import * as React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { Index } from "./pages";
import "./style.less";

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

function App({ name, enthusiasmLevel = 1 }: Props) {
  if (enthusiasmLevel <= 0) {
    throw new Error("You could be a little more enthusiastic. :D");
  }

  return (
    <>
      <HashRouter>
        <Switch>
          <Route exact={true} path="/" component={Index} />
        </Switch>
      </HashRouter>
    </>
  );
}

export default App;
