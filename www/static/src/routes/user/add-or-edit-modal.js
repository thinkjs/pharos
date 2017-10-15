import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal,Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  current = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps,
}) => {

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        id:current.id,
        ...getFieldsValue()
      };
      onOk(data)
    })
  };

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  };

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="用户昵称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('display_name', {
            initialValue: current.display_name,
            rules: [
              {
                required: true,
                message: '昵称不能为空',
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            // initialValue: current.password,
            rules: [
              {
                min: 8,
                max: 20,
                required: true,
                message:'请输入密码,长度8~20个字符'
              },
            ],
          })(<Input type="password" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  current: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
