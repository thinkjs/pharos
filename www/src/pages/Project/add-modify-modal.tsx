import * as React from 'react';
import { observer, inject } from 'mobx-react';
import {
  Input,
  Modal
}
  from "antd";


@inject('projectStore') @observer
class AddModifyModal extends React.Component<any, any> {

  render() {
    const { projectStore } = this.props
    const { showAddModifyModal, currentModel, isEdit, setShowAddModifyModal, setCurrentModel } = projectStore
    return (
      <Modal
        title={isEdit ? '修改项目' : '添加项目'}
        visible={showAddModifyModal}
        onOk={projectStore.addModify}
        onCancel={() => setShowAddModifyModal(false)}>
        <div style={{ marginBottom: 30 }}>
          <span>名字</span>
          <Input placeholder="请输入名字" value={currentModel.name} onChange={(e) => setCurrentModel({ name: e.target.value })} />
        </div>
        <div>
          <span>网址</span>
          <Input placeholder="请输入网址" value={currentModel.url} onChange={(e) => setCurrentModel({ url: e.target.value })} />
        </div>
      </Modal>
    )
  }
}

export default AddModifyModal