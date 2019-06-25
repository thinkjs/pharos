import * as React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message, Modal } from 'antd'
import { observer, inject } from 'mobx-react';

import './style.less'


@inject('projectStore') @observer
class Config extends React.Component<any, any> {

  render() {
    const { projectStore } = this.props
    const { showDeleteModal, setShowDeleteModal, jsString } = projectStore
    return (
      <div className="config-wrap">
        <div className="config-wrap-content">
          <div className="copy-btn" onClick={() => message.info('已复制到剪贴板')}>
            <CopyToClipboard text={jsString}>
              <span className="btn-flat">复制</span>
            </CopyToClipboard>
          </div>
          <pre>{jsString}</pre>
        </div>
        {/* <div className="group-item">
          <div className="group-item-label">删除项目：
            <Button type="default" onClick={() => setShowDeleteModal(true)}>删除项目</Button>
          </div>
        </div> */}
        <Modal
          title="删除项目"
          visible={showDeleteModal}
          onOk={projectStore.deleteProject}
          onCancel={() => setShowDeleteModal(false)}
        >
          确定删除项目吗？
        </Modal>
      </div>
    )
  }

}

export default Config