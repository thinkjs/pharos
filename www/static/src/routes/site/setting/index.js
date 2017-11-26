import React from 'react';
import { connect } from 'dva';
import { Page } from 'components';
import { Form, Input, Button,Row,Col } from 'antd';

const FormItem = Form.Item;

function Whatever({
  dispatch,
  site,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) {
  const {optionsData = {}} = site;
  console.log(optionsData)
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type:'site/options',
          payload:values
        })
      }
    });
  }

  const formItemLayout = {
    labelCol: {
      span:1
    },
    wrapperCol: {
      span:8
    },
  };
  return (
    <Page>
      <Form onSubmit={handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="阈值"
        >
          {getFieldDecorator('limit',{
            initialValue:optionsData && optionsData.limit
          })(
            <Input placeholder="阈值" />
          )}
        </FormItem>
        <FormItem>
          <Row>
            <Col offset={3}>
              <Button type="primary" htmlType="submit">提交</Button>            
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Page>
  );
}
export default connect(({ site, app }) => ({ site, app }))(Form.create()(Whatever))