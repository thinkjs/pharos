import * as React from "react";
import { HashRouter, Switch, Route } from 'react-router-dom';
import { PageA } from './pages/PageA';
import { PageB } from './pages/PageB';


export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

function App({ name, enthusiasmLevel = 1 }: Props) {
  if (enthusiasmLevel <= 0) {
    throw new Error('You could be a little more enthusiastic. :D');
  }

  return (
    <>
      <HashRouter>
        <Switch>
          <Route exact={true} path="/" component={PageA} />
          <Route path="/pageB" component={PageB} />
        </Switch>
      </HashRouter>
    </>
  );
}

export default App;
