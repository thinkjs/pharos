import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Modal, Form, Col } from "antd";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 50
  },
};

@inject('metricStore') @observer
class AddModifyModal extends React.Component<any, any> {

  state = {
    factorList: [{
      name: '',
      value: '',
      index: 1
    }]
  }

  handleOk = (e: any) => {
    e.preventDefault();
    const { metricStore, form } = this.props
    form.validateFields(async (err, values: string) => {
      const factor = this.formatFactors(this.state.factorList)
      values = Object.assign(values, factor)
      if (!err) {
        metricStore.addModifyMetric(values)
      }
    });

  }

  formatFactors = (list) => {
    const factor = {}
    list.forEach((item, index) => {
      factor[`k${index + 1}`] = item['value']
      factor[`k${index + 1}_display_name`] = item['name']
    })
    return factor
  }

  changeFactorKey(value, key, index) {
    if (/display_name/.test(key)) {
      key = 'name'
    } else {
      key = 'value'
    }
    this.state.factorList[index][key] = value
    this.setState({
      factorList: this.state.factorList
    })
  }

  addFactor = (index) => {
    if (index < 4) {
      this.state.factorList.push({
        name: '',
        value: '',
        index
      })
      this.setState({
        factorList: this.state.factorList
      })
    }
  }

  deleteFactor = (index) => {
    this.state.factorList.splice(index, 1)
    this.setState({
      factorList: this.state.factorList
    })
  }

  isEnglishName(rule, value, callback) {

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { metricStore } = this.props
    const { showAddModifyModal, isEdit, setShowAddModifyModal } = metricStore
    return (
      <Modal
        title={isEdit ? '修改监控项' : '添加监控项'}
        visible={showAddModifyModal}
        onOk={this.handleOk}
        onCancel={() => setShowAddModifyModal(false)}
        wrapClassName="add-modify-metric-modal"
      >
        <Form {...formItemLayout} layout="inline">
          <Form.Item label="英文名" hasFeedback >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '名字不能为空'
                },
                {
                  pattern: /^[a-zA-Z]+$/,
                  message: '须填英文'
                }
              ],
            })(<Input placeholder="英文名" />)}
          </Form.Item>
          <Form.Item label="中文名" hasFeedback >
            {getFieldDecorator('display_name', {
              rules: [
                {
                  required: true,
                  message: '名字不能为空'
                },
                {
                  pattern: /[\u4e00-\u9fa5]+/g,
                  message: '须填中文'
                }
              ],
            })(<Input placeholder="中文名" />)}
          </Form.Item>
          <Form.Item label="统计纬度：">
            <div className="factor-content">
              <div className="factor-content-title">
                <Col span={10}><span className="fcit-item">英文</span></Col>
                <Col span={10}><span className="fcit-item">中文</span></Col>
              </div>
              {this.state.factorList.map((item, index) => {
                return (
                  <div className="factor-content-item" key={index}>
                    <Col span={10}>
                      <Form.Item hasFeedback>
                        <Input value={item.value} onChange={(e) => this.changeFactorKey(e.target.value, `k${index + 1}`, index)} />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item hasFeedback>
                        <Input value={item.name} onChange={(e) => this.changeFactorKey(e.target.value, `k${index + 1}_display_name`, index)} />
                      </Form.Item>
                    </Col>
                    <Col span={2} >
                      {this.state.factorList.length - 1 == index ? <a className="btn-display-inline" style={{ color: '#53a932' }} onClick={() => { this.addFactor(index) }}>➕
                      </a> : null}
                      {this.state.factorList.length > 1 ? <a className="btn-display-inline" style={{ color: 'red' }} onClick={() => { this.deleteFactor(index) }}>➖
                      </a> : null}
                    </Col>
                  </div>
                )
              })}
            </div>
          </Form.Item>
          <Form.Item label="备注" >
            {getFieldDecorator('description')
              (<TextArea rows={4} cols={36} placeholder="描述" />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const AddModifyModalForm = Form.create()(AddModifyModal)

export default AddModifyModalForm