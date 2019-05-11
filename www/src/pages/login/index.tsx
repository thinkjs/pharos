import * as React from 'react';
import { Form, Button, Input, Row } from 'antd';
import { Link } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form';
import axios from '../../components/axios';
import { baseURL } from '../../config/domain'
import history from '../../components/history'
import './index.less'

interface LoginFormProps extends FormComponentProps {
  imgToken: any
}

class LoginForm extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }


  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const result = await axios.post('/api/token', values)
        if (result) {
          localStorage.setItem('isLogin', result.data.name)
          history.push('/index')
        }
      }
    });

  }

  handleRefresh = async () => {
    document.querySelector('#imgToken').setAttribute('src', `${baseURL}api/token?v=${Date.now()}`)
  }

  render() {
    let refreshToken = undefined;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="form">
        <div className="logo">
          <img />
          <span></span>
        </div>
        <Form onSubmit={this.handleOk}>
          <Form.Item hasFeedback >
            {getFieldDecorator('credential', {
              rules: [
                {
                  required: true,
                  message: '用户名不能为空'
                },
              ],
            })(<Input size="large" placeholder="用户名" />)}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '密码不能为空'
                },
              ],
            })(<Input size="large" type="password" placeholder="密码" />)}
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
              <div className="img-token-wrap">
                <Input size="large" type="text" onPressEnter={this.handleOk} placeholder="验证码" />
                <img id="imgToken" src={`${baseURL}api/token?v=${refreshToken}`} onClick={this.handleRefresh} />
              </div>
            )}
          </Form.Item>
          <Row>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
          </Button>
            <p>
              <a href="/api/token/intranet">域账号登录</a><br />
              <Link to="/register">没有账号？现在注册</Link>
            </p>
          </Row>
        </Form>
      </div>
    )
  }
}

const Login = Form.create()(LoginForm)

export default Login