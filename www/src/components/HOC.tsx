import * as React from 'react'
import Layout from '@components/Layout'
import { Provider } from 'mobx-react'
// import { appRootStore } from '@store/index'

const HOC = (Component, store) => {
  return class Wrap extends React.Component {
    render() {
      return (
        <Provider {...store}  >
          <Layout {...this.props}>
            <Component {...this.props} />
          </Layout>
        </Provider >
      )
    }
  }
}

export default HOC