import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'
import { config } from 'utils'
import styles from './index.less'

const FormItem = Form.Item;

const Login = ({
  login,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  const { loginLoading } = login;
  let img;

  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/register', payload: {values} })
    })
  }

  const goLogin = ()=>{
    dispatch({
      type:'app/redirect',
      payload:'/login'
    })
  }

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img src={config.logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="用户名" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('display_name', {
            rules: [
              {
                min: 4,
                max: 10,
                required: true,
                message:'请输入用户昵称,长度4~10个字符'
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="用户昵称" />)}
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
          })(<Input size="large" onPressEnter={handleOk} placeholder="邮箱" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                min: 8,
                max: 20,
                required: true,
                message:'请输入密码,长度8~20个字符'
              },
            ],
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码" />)}
        </FormItem>
        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
            注 册
          </Button>
          <p>
            <a onClick={goLogin}>已有账号？现在登录</a>
          </p>
        </Row>
      </form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ login }) => ({ login }))(Form.create()(Login))
