import * as React from 'react'
import AppRoute from './components/AppRoute'
import { Provider } from 'mobx-react'
import './components/style/index.less'
import store from './app.store'

const App = () => (<Provider {...store}><AppRoute /></Provider>)

export default App