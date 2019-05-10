import * as React from "react";
import { Button, Row, Form, Input } from 'antd'
import { Link } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form';
import axios from '../../components/axios';
import history from '../../components/history'

const FormItem = Form.Item;

interface LoginFormProps extends FormComponentProps { }

class ItemList extends React.Component<LoginFormProps, any> {

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const result = await axios.post('/api/user', values)
        if (result) {
          localStorage.setItem('token', result.data.token)
          history.push('/index')
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="form">
        <div >
          <img />
          <span></span>
        </div>
        <Form onSubmit={this.handleOk}>
          <FormItem hasFeedback>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input size="large" placeholder="用户名" />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('display_name', {
              rules: [
                {
                  min: 4,
                  max: 10,
                  required: true,
                  message: '请输入用户昵称,长度4~10个字符'
                },
              ],
            })(<Input size="large" placeholder="用户昵称" />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email', message: '邮箱不合法',
                },
                {
                  required: true, message: '邮箱不能为空',
                }
              ],
            })(<Input size="large" placeholder="邮箱" />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  min: 8,
                  max: 20,
                  required: true,
                  message: '请输入密码,长度8~20个字符'
                },
              ],
            })(<Input size="large" type="password" placeholder="密码" />)}
          </FormItem>
          <Row>
            <Button type="primary" htmlType="submit" className="login-form-button">
              注册
          </Button>
            <p>
              <Link to="/login">已有账号？现在登录</Link>
            </p>
          </Row>
        </Form>
      </div>
    );
  }
}

const Register = Form.create()(ItemList)

export default Register
