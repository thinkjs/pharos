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
  userList,
  fetchUser,
  ...modalProps,
}) => {

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      };
      data.id = data.id.join(',');
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
        <FormItem label="用户" hasFeedback {...formItemLayout}>
          {getFieldDecorator('id', {
            rules: [
              {
                required: true,
                message: '用户不能为空',
              }
            ]
          })(
            <Select
              mode="multiple"
              multiple={false}
              optionFilterProp="children"
              //notFoundContent={false ? <Spin size="small" /> : null}
              //filterOption={false}
              onSearch={fetchUser}
            >
              {
                (userList || []).map((item,index)=>{
                  return (
                    <Option value={item.id && item.id.toString()} label={item.name} key={index}>{item.name}</Option>
                  )
                })
              }
            </Select>
          )}
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
