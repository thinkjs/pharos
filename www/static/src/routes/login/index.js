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
  const { loginLoading, refreshToken } = login;
  let img;

  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: {values,img} })
    })
  }

  const goRegister = ()=>{
    dispatch({
      type:"app/redirect",
      payload:'/register'
    })
  };

  function handleRefresh(){
    dispatch({
      type:'login/reloadCode',
      payload:{
        img
      }
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
          {getFieldDecorator('credential', {
            rules: [
              {
                required: true,
                message:'用户名不能为空'
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="用户名" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message:'密码不能为空'
              },
            ],
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('captcha', {
            rules: [
              {
                required: true,
                message:'验证码不能为空'                
              },
            ],
          })(
            <div>
              <Input className={styles.codeText} size="large" type="text" onPressEnter={handleOk} placeholder="验证码" />
              <img className={styles.codeImg} ref={c => (img = c)} src={`${config.baseURL}api/token?v=${refreshToken}`} onClick={handleRefresh} />
            </div>
          )}
        </FormItem>
        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
            登 录
          </Button>
          <p>
            <a onClick={goRegister}>没有账号？现在注册</a>
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
