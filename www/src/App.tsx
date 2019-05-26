import * as React from 'react'
import AppRoute from './components/AppRoute'
import { Provider } from 'mobx-react'
import store from './app.store'
import './style.less'

const App = () => (<Provider {...store}><AppRoute /></Provider>)

export default App