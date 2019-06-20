import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Modal, Form, Select, InputNumber } from "antd";
import './model.less'

const { Option } = Select;
const relate = ['=>', '=', '<=']

@inject('metricStore', 'strategyStore') @observer
class StartegyModal extends React.Component<any, any> {
  componentDidMount() {
    const { metricStore } = this.props
    metricStore.getList()
  }

  handleOk = (e: any) => {
    e.preventDefault();
    const { form } = this.props
    form.validateFields(async (err, values: any) => {
      if (!err) {
        const { strategyStore, metricStore } = this.props
        const { list } = metricStore
        const { defaultVal, changeItem, addItem } = strategyStore
        if (defaultVal.create_time) {
          //antd的默认值问题
          if (typeof values.metric_id === 'string') {
            list.forEach(item => {
              if (item.display_name === values.metric_id) {
                values.metric_id = item.id
              }
            })
          }
          changeItem(values)
        } else {
          addItem(values)
        }
      } else {
        console.log(err)
      }
    });

  }
  initDisplayName = (id) => {
    const { metricStore } = this.props
    const { list } = metricStore
    let ret = ''
    list.forEach(item => {
      if (item.id === id) {
        ret = item.display_name
      }
    });
    return ret
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { metricStore, strategyStore } = this.props
    const { list } = metricStore
    const { modalStatus, hideModal, defaultVal } = strategyStore
    return (
      <Modal
        title={defaultVal.id ? '修改监控项' : '添加监控项'}
        visible={modalStatus}
        onCancel={hideModal}
        onOk={this.handleOk}
        className="strategy--modal"
      >
        <Form layout="inline">
          <div>
            <Form.Item label="策略名称" hasFeedback >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '名字不能为空'
                  },
                ],
                initialValue: defaultVal.name
              })(<Input placeholder="策略名称" style={{ width: 300 }} />)}
            </Form.Item>
          </div>
          <div>
            <Form.Item label="监控项" hasFeedback >
              {getFieldDecorator('metric_id', {
                rules: [
                  {
                    required: true,
                    message: '监控项不能为空'
                  }
                ], initialValue: this.initDisplayName(defaultVal.metric_id)
              })(<Select style={{ width: '300px' }} placeholder="请选择" onChange={() => { }}>
                {
                  list.map(opt => <Option key={opt.id}>{opt.display_name} </Option>)
                }
              </Select>)}
            </Form.Item>
          </div>
          <div>
            <Form.Item label="策略内容" hasFeedback >
              {getFieldDecorator('count', {
                rules: [
                  {
                    required: true,
                    message: '策略内容不能为空'
                  },
                ],
                initialValue: parseInt(defaultVal.count)
              })(
                <div>
                  <span>监控数值连续</span>
                  <InputNumber min={1} max={60} onChange={() => { }} defaultValue={parseInt(defaultVal.count)} />
                  <span>次</span>
                </div>
              )}
            </Form.Item>
          </div>
          <div>
            <Form.Item label="策略关系" hasFeedback >
              {getFieldDecorator('expression', {
                rules: [
                  {
                    required: true,
                    message: '关系不能为空'
                  },
                ],
                initialValue: defaultVal.expression
              })(<Select style={{ width: '300px' }} placeholder="请选择" onChange={() => { }}>
                {
                  relate.map(item => <Option key={item}>{item} </Option>)
                }
              </Select>)}
            </Form.Item>
          </div>
          <div>
            <Form.Item label="阈值" hasFeedback >
              {getFieldDecorator('limit', {
                rules: [
                  {
                    required: true,
                    message: '阈值不能为空'
                  },
                ],
                initialValue: defaultVal.limit
              })(<Input placeholder="阈值" style={{ width: 300 }} />)}
            </Form.Item>
          </div>
        </Form>
      </Modal>
    )
  }
}

const StartegyModalForm = Form.create()(StartegyModal)

export default StartegyModalForm