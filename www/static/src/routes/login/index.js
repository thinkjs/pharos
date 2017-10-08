import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import md5 from 'blueimp-md5';
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
      values.pass = md5(values.pass);
      dispatch({ type: 'login/login', payload: {values,img} })
    })
  }

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
        <img alt={'logo'} src={config.logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="用户名" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('pass', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('token', {
            rules: [
              {
                required: true,
              },
            ],
          })(
            <div>
              <Input className={styles.codeText} size="large" type="text" onPressEnter={handleOk} placeholder="验证码" />
              <img className={styles.codeImg} ref={c => (img = c)} src={`${config.baseURL}login/login/getToken`} onClick={handleRefresh} />
            </div>
          )}
        </FormItem>
        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
            登 录
          </Button>
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
