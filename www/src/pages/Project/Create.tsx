import * as React from 'react'
import { Form, Button, Input } from 'antd';
import { observer, inject } from 'mobx-react';
import './create.less'

const formItemLayout = {
  labelCol: {
    span: 50
  },
  wrapperCol: {
    span: 50
  },
};

@inject('projectStore') @observer
class CreateForm extends React.Component<any, any> {

  handleOk = (e) => {
    e.preventDefault();
    const { projectStore, form } = this.props
    form.validateFields(async (err, values: string) => {
      if (!err) {
        projectStore.createProject(values)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="create-project">
        <div className="create-project-title">添加项目</div>
        <div className="create-project-form">
          <Form {...formItemLayout} onSubmit={this.handleOk}>
            <Form.Item label="项目名" hasFeedback >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '项目名不能为空'
                  },
                ],
              })(<Input size="large" />)}
            </Form.Item>
            <Form.Item label="网址" hasFeedback >
              {getFieldDecorator('url', {
                rules: [
                  {
                    required: true,
                    message: '网址不能为空'
                  },
                ],
              })(<Input size="large" />)}
            </Form.Item>
            <Button type="primary" htmlType="submit" className="create-project-button">
              添加
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}

const CreateProject = Form.create()(CreateForm)

export default CreateProject