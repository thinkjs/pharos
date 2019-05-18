import * as React from 'react';
import { Form, Button, Input, Row } from 'antd';
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import { baseURL } from '../../../config/domain'
import './index.less'
import { LoginFormProps } from '../proto/signin';


@inject('signinStore') @observer
class LoginForm extends React.Component<LoginFormProps, any> {


  handleOk = (e: any) => {
    e.preventDefault();
    const { signinStore, form } = this.props
    form.validateFields(async (err, values: string) => {
      if (!err) {
        signinStore.submit(values)
      }
    });

  }



  render() {
    let refreshToken = undefined;
    const { getFieldDecorator } = this.props.form;
    const { signinStore } = this.props
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
                <img id="imgToken" src={`${baseURL}api/token?v=${refreshToken}`} onClick={signinStore.refreshToken} />
              </div>
            )}
          </Form.Item>
          <Row>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
          </Button>
            <p>
              <a href="/api/token/intranet">域账号登录</a><br />
              <Link to="/signup">没有账号？现在注册</Link>
            </p>
          </Row>
        </Form>
      </div>
    )
  }
}

const Login = Form.create()(LoginForm)

export default Login