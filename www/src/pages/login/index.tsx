import * as React from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Form, Button, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import axios from 'axios';
import './index.less'

let baseURL = '127.0.0.1:8360/'

interface LoginFormProps extends FormComponentProps {

}

class LoginForm extends React.Component<LoginFormProps, any> {

  async componentDidMount() {
    const result = await axios.post(`http://${baseURL}api/token?v=${222}`)
    console.log(834, result)
  }

  handleOk = () => {
    console.log(1)
  }

  handleRefresh = () => {
    console.log(2)
  }

  goRegister = () => {
    console.log(3)
  }
  // props: any;

  render() {
    let refreshToken = undefined;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="form">
        <div className="logo">
          <img />
          <span></span>
        </div>
        <form>
          <Form.Item hasFeedback>
            {getFieldDecorator('credential', {
              rules: [
                {
                  required: true,
                  message: '用户名不能为空'
                },
              ],
            })(<Input size="large" onPressEnter={this.handleOk} placeholder="用户名" />)}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '密码不能为空'
                },
              ],
            })(<Input size="large" type="password" onPressEnter={this.handleOk} placeholder="密码" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('captcha', {
              rules: [
                {
                  required: true,
                  message: '验证码不能为空'
                },
              ],
            })(
              <div>
                <Input size="large" type="text" onPressEnter={this.handleOk} placeholder="验证码" />
                <img src={`http://${baseURL}api/token?v=${refreshToken}`} onClick={this.handleRefresh} />
              </div>
            )}
          </Form.Item>
          <Row>
            <Button type="primary" size="large" onClick={this.handleOk} loading={false}>
              登 录
          </Button>
            {/* <Button size="large" onClick={handleOk} loading={loginLoading}>
            域账号登录
          </Button> */}
            <p>
              <a href="/api/token/intranet">域账号登录</a><br />
              <a onClick={this.goRegister}>没有账号？现在注册</a>
            </p>
          </Row>
        </form>
      </div>
    )
  }
}

const Login = Form.create()(LoginForm)

export default Login