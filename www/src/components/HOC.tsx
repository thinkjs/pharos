import * as React from 'react'
import Layout from '@components/Layout'
import { withRouter } from 'react-router-dom';
import { Provider } from 'mobx-react'
import { appRootStore } from '@store/index'
import { RouteComponentProps } from "react-router";
import axios from '@utils/axios';



const HOC = (Component, store) => {
  class Wrap extends React.Component<RouteComponentProps<{}>, any> {

    state = {
      isFinishFetch: false,
    }

    async componentDidMount() {
      if (!localStorage.getItem('projectId')) {
        const result = await axios.get('/api/site')
        const data = result.data.data
        if (data.length) {
          localStorage.setItem('projectId', data[0].id)
          this.setState({
            isFinishFetch: true,
          })
        } else {
          window.location.href = '/signin'
        }
      } else {
        this.setState({
          isFinishFetch: true
        })
      }
    }

    render() {
      if (!this.state.isFinishFetch) return null
      return (
        <Provider {...store} appRootStore={appRootStore}  >
          <Layout {...this.props}>
            <Component {...this.props} />
          </Layout>
        </Provider >
      )
    }
  }

  return withRouter(Wrap)
}

export default HOC