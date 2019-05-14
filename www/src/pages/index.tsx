import * as React from "react";
import { Switch, Link, Route, BrowserRouter as Router } from "react-router-dom";
import { Menu, Layout } from "antd";
import Manage from './manage';
import Analyse from './analyse'
import ItemList from './itemlist';
import axios from '../components/axios'
import history from '../components/history'
import './index.less';

const { Header } = Layout;

class Index extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }


  logout = async () => {
    const result = await axios.delete('/token');
    if (result) {
      localStorage.removeItem('isLogin');
      history.push('/login')
    }
  }

  async componentDidMount() {
    // const result = await axios.get('/user');
    // console.log(45, result)
    // if (result) {
    //   this.setState({
    //     user: result
    //   })
    // }

  }

  render() {
    const userName = localStorage.getItem('isLogin')
    return (
      <Layout style={{ height: "100%" }}>
        <Router>
          <Header
            style={{ paddingLeft: 0, height: 100 }}
          >
            <Menu
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode="horizontal"
              theme="dark"
              style={{ marginLeft: 200 }}
            >
              <Menu.Item key="1">
                <Link to="/index">项目管理</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/index/analyse">性能分析</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/index/list">项目列表</Link>
              </Menu.Item>
            </Menu>
            <div className="user-info-wrap">
              {userName ? <div>
                <span className="user-name">{userName}</span>
                <span className="logout" onClick={this.logout}>登出</span>
              </div> : null}
            </div>
          </Header>
          <Layout>
            <Switch>
              <Route path="/index" component={Manage} />
              <Route path="/index/analyse" component={Analyse} />
              <Route path="/index/list" component={ItemList} />
            </Switch>
          </Layout>
        </Router>
      </Layout>
    )
  }
}

export default Index
