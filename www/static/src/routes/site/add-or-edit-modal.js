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
        <FormItem label="网站名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: current.name,
            rules: [
              {
                required: true,
                message: '网站名称不能为空',
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label="网站地址" hasFeedback {...formItemLayout}>
          {getFieldDecorator('url', {
            initialValue: current.url,
            rules: [
              {
                required: true,
                message: '网站地址不能为空',
              }
            ]
          })(<Input />)}
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
