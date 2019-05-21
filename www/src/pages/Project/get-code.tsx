import * as React from 'react';
import { observer, inject } from 'mobx-react';
import {
  Modal,
  Alert,
  message
}
  from "antd";

@inject('projectStore') @observer
class GetCodeModal extends React.Component<any, any> {

  copy = (codeStr: string) => {
    var oInput = document.createElement('input');
    oInput.value = codeStr;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.style.display = 'none';
    message.info('已成功复制到粘贴板');
  }
  render() {
    const { projectStore } = this.props
    const { showGetCodeModal, currentModalSid, currentModalUrl, setShowGetCodeModal } = projectStore
    let codeStr = `
        <script 
          src="//lib.baomitu.com/lightkeeper/latest/pharos.min.js"
          data-siteid="${currentModalSid}"
          data-host="${currentModalUrl.split(':')[1]}"  
        ></script>
        <script type="text/javascript">
        window.addEventListener('load', function() {
          pharos.monitor();
        });
        </script>`
    return (
      <Modal
        title={'获取代码'}
        visible={showGetCodeModal}
        okText="复制代码"
        onOk={() => this.copy(codeStr)}
        onCancel={() => setShowGetCodeModal(false, '', '')}
      >
        <Alert message="此代码同时适用于PC端、移动端的页面，请将此代码复制并粘贴到您要跟踪的每个网页中。" type="success" />
        <p>{codeStr}</p>
      </Modal>
    )
  }
}

export default GetCodeModal